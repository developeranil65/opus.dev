import { Worker, Job } from 'bullmq';
import { Poll } from '../models/poll.model.js';
import { Vote } from '../models/vote.model.js';
import { pubClient, connectRedis } from '../utils/redis.js';
import connectDB from '../db/connect.db.js';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const redisOptions = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
};

const startWorker = async () => {
  try {
    await connectDB();
    await connectRedis();
    console.log("✅ Worker connected to Redis & MongoDB");
  } catch (err) {
    console.error("Worker connection failed", err);
    process.exit(1);
  }
};

startWorker();

const processVote = async (job: Job) => {
  const { pollCode, selectedOptions, voterIP, userId } = job.data;

  try {
    // 1. Check if poll exists and is not expired
    const pollCheck = await Poll.findOne({ pollCode }).select("expiresAt");
    
    if (!pollCheck) {
      throw new Error("Poll not found");
    }

    if (pollCheck.expiresAt && new Date(pollCheck.expiresAt) < new Date()) {
      console.log(`Poll ${pollCode} expired. Vote rejected.`);
      return;
    }

    // 2. Create the Audit Record
    await Vote.create({
      poll: pollCheck._id,
      selectedOptions,
      voterIP,
      user: userId,
    });

    // 3. ATOMIC UPDATE
    const updatedPoll = await Poll.findOneAndUpdate(
      { 
        pollCode: pollCode,
        "voters.ip": { $ne: voterIP } 
      },
      {
        $inc: { "options.$[elem].votes": 1 }, 
        $push: { voters: { ip: voterIP } }    
      },
      {
        arrayFilters: [ { "elem.text": { $in: selectedOptions } } ], 
        new: true 
      }
    );

    if (!updatedPoll) {
      console.log(`Duplicate vote blocked by DB for ${voterIP} on ${pollCode}`);
      return;
    }

    // 4. Batch/Throttle Updates (Optimization from previous discussion)
    const throttleKey = `broadcast_cooldown:${pollCode}`;
    const shouldBroadcast = await pubClient.set(throttleKey, '1', {
      NX: true,      
      PX: 1000       // 1 second throttle
    });

    if (shouldBroadcast) {
        await pubClient.del(`poll:results:${pollCode}`);

        const liveResults = updatedPoll.options.map(opt => ({
            text: opt.text,
            votes: opt.votes,
        }));

        await pubClient.publish('poll_updates', JSON.stringify({
            pollCode: pollCode,
            data: {
                type: "VOTE_UPDATE",
                pollCode: pollCode,
                results: liveResults,
            }
        }));
        
        console.log(`📡 Batch Update sent for ${pollCode}`);
    }

  } catch (error) {
    console.error(`❌ Job Failed for ${pollCode}:`, error);
    throw error; 
  }
};

const worker = new Worker('vote-queue', processVote, {
  connection: redisOptions,
  concurrency: 5, 
});

console.log("👷 Vote Worker Started...");

export default worker;