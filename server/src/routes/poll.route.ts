import { Router } from "express";
import { verifyJWT, verifyJWT_Optional } from "../middlewares/auth.middleware";
import { createPoll, getPollByCode, getPollResults, deletePoll, getMyPolls } from "../controllers/poll.controller";

const router = Router();

// Secured routes
router.post("/", verifyJWT, createPoll);
router.delete("/:code", verifyJWT, deletePoll);
router.get("/my-polls", verifyJWT, getMyPolls);

// Public routes
router.get("/:code/results", verifyJWT_Optional, getPollResults);
router.get("/:code", getPollByCode);

export default router;