import { Router } from "express";
import { votePoll } from "../controllers/vote.controller";

const router = Router();

// public vote route
router.post("/:pollCode/vote", votePoll);

export default router;