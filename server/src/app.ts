import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet"; 
import rateLimit from "express-rate-limit"; 
// import { ApiError } from "./utils/ApiError.js"; // Unused in this file but good to have

const app = express();

app.use(helmet());

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 100, 
  standardHeaders: true, 
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again later."
});

app.use(limiter);
app.set('trust proxy', 1);

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes
import userRouter from './routes/user.route.js';
import pollRouter from './routes/poll.route.js';
import voteRouter from './routes/vote.route.js';

app.use("/api/v1/users", userRouter);
app.use("/api/v1/polls", pollRouter);
app.use("/api/v1/votes", voteRouter);

app.use("*", (req: Request, res: Response) => {
  res.status(404).json({
      success: false,
      message: "Route not found"
  });
});

export { app };