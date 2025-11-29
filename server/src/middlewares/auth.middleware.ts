import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User, IUser } from "../models/user.model";

// Extend Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

export const verifyJWT = asyncHandler(async(req: Request, _: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    
        if (!token) {
            throw new ApiError(401, "Unauthorized request"); 
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as JwtPayload;
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
    
        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }
    
        req.user = user;
        next();
    } catch (error: any) {
        throw new ApiError(401, error?.message || "Invalid access Token");
    }
});

export const verifyJWT_Optional = asyncHandler(async(req: Request, _: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    
        if (!token) return next();
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as JwtPayload;
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
    
        if (user) {
            req.user = user;
        }
        next();
    } catch (error) {
        next();
    }
});