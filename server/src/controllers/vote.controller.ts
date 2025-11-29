import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { voteQueue } from "../utils/queue.js";
import { pubClient } from "../utils/redis.js"; 

const votePoll = asyncHandler(async (req: Request, res: Response) => {
  const { pollCode } = req.params;
  const { selectedOptions } = req.body;
  
  const voterIP = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "unknown";
  const userId = req.user ? req.user._id : null;

  if (!Array.isArray(selectedOptions) || selectedOptions.length === 0) {
    throw new ApiError(400, "selectedOptions must be a non-empty array");
  }

  // --- REDIS ATOMIC LOCK ---
  const dedupKey = `vote_lock:${pollCode}:${voterIP}`;

  const isNewVote = await pubClient.set(dedupKey, '1', {
    NX: true, 
    EX: 86400 
  });

  if (!isNewVote) {
    throw new ApiError(403, "You have already voted in this poll (Redis Guard)");
  }

  // 2. Add Job to Queue
  await voteQueue.add('vote', {
    pollCode,
    selectedOptions,
    voterIP,
    userId
  }, {
    removeOnComplete: true,
    removeOnFail: 100
  });

  return res
    .status(202) 
    .json(new ApiResponse(202, null, "Vote received and queued for processing"));
});

export { votePoll };