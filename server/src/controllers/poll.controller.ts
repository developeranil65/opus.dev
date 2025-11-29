import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { generatePollCode } from "../utils/pollCodeGenerator.js";
import { generateQRCodeAndUpload } from "../utils/qrCodeGenerator.js";
import { Poll, IPoll } from "../models/poll.model.js";
import { pubClient } from "../utils/redis.js";

const createPoll = asyncHandler(async (req: Request, res: Response) => {
    const { title, options, isMultipleChoice, isPublicResult, expiresAt } = req.body;

    const pollCode = generatePollCode();
    const pollUrl = `${process.env.FRONTEND_URL}/vote/${pollCode}`;
    const pollqr = await generateQRCodeAndUpload(pollUrl);

    // Ensure req.user exists via Auth middleware
    if (!req.user) throw new ApiError(401, "Unauthorized");

    const poll = await Poll.create({
        title,
        options,
        isMultipleChoice,
        isPublicResult,
        expiresAt,
        pollCode,
        qrUrl: pollqr,
        createdBy: req.user._id
    });

    if (!poll) {
        throw new ApiError(500, "Something went wrong while creating the poll");
    }
        
    return res.status(201).json(
        new ApiResponse(201, poll, "Poll created successfully")
    );
});

const getPollByCode = asyncHandler(async (req: Request, res: Response) => {
    const { code } = req.params;

    const poll = await Poll.findOne({ pollCode: code }).select("-voters -createdBy -__v");

    if (!poll) {
        throw new ApiError(404, "Poll not found");
    }

    // Return options without vote counts
    const strippedOptions = poll.options.map(opt => ({
        text: opt.text
    }));

    const response = {
        _id: poll._id,
        title: poll.title,
        options: strippedOptions,
        pollCode: poll.pollCode,
        qrUrl: poll.qrUrl,
        isMultipleChoice: poll.isMultipleChoice,
        isPublicResult: poll.isPublicResult,
        expiresAt: poll.expiresAt,
        createdAt: poll.createdAt,
    };

    res.status(200).json(new ApiResponse(200, response, "Poll fetched successfully"));
});

const getPollResults = asyncHandler(async (req: Request, res: Response) => {
    const { code } = req.params;

    // 1. CACHE HIT CHECK
    const cachedResults = await pubClient.get(`poll:results:${code}`);
    
    if (cachedResults) {
        return res.status(200).json(
            new ApiResponse(200, JSON.parse(cachedResults), "Results fetched from Cache")
        );
    }

    // 2. CACHE MISS
    const poll = await Poll.findOne({ pollCode: code }).select("options title isPublicResult createdBy");

    if (!poll) {
        throw new ApiError(404, "Poll not found");
    }

    const isCreator = req.user && poll.createdBy.toString() === req.user._id.toString();
    if (!poll.isPublicResult && !isCreator) {
        throw new ApiError(403, "Results for this poll are private");
    }

    const totalVotes = poll.options.reduce((sum, opt) => sum + (opt.votes || 0), 0);
    const results = poll.options.map(opt => ({
        text: opt.text,
        votes: opt.votes || 0,
        percentage: totalVotes > 0 ? ((opt.votes / totalVotes) * 100).toFixed(1) : "0.0",
    }));

    const responseData = {
        title: poll.title,
        totalVotes,
        results,
    };

    await pubClient.setEx(
        `poll:results:${code}`, 
        3600, 
        JSON.stringify(responseData)
    );

    res.status(200).json(
        new ApiResponse(200, responseData, "Live results fetched successfully")
    );
});

const deletePoll = asyncHandler(async (req: Request, res: Response) => {
    const { code } = req.params;

    const poll = await Poll.findOne({ pollCode: code });
    if (!poll) {
        throw new ApiError(404, "Poll not found");
    }

    if (!req.user || (poll.createdBy && poll.createdBy.toString() !== req.user._id.toString())) {
        throw new ApiError(403, "You are not authorized to delete this poll");
    }

    await Poll.deleteOne({ _id: poll._id });

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Poll deleted successfully"));
});

const getMyPolls = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, "Unauthorized");

    const polls = await Poll.find({ createdBy: req.user._id })
        .select("title pollCode createdAt expiresAt isPublicResult qrUrl")
        .sort({ createdAt: -1 });

    res.status(200).json(
        new ApiResponse(200, polls, "Your polls fetched successfully")
    );
});

export { createPoll, getPollByCode, getPollResults, deletePoll, getMyPolls };