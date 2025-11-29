# Opus Backend Service

The core engine of the Opus platform. This is a Node.js/TypeScript service designed for high-concurrency event processing. It handles authentication, poll management, and the high-throughput voting pipeline.

## Core Patterns & Implementation

### 1. Hybrid Storage Strategy

We use a polyglot persistence layer to optimize for speed and reliability:

- **Redis:** Used for ephemeral data (Job Queues), fast lookups (Locks), and real-time messaging (Pub/Sub).
- **MongoDB:** Used for durable storage. We utilize specific Schema designs (embedding Options within Polls) to allow for atomic updates.

### 2. The Voting Pipeline (Deep Dive)

To ensure sub-20ms response times, the `POST /vote` endpoint does almost zero work:

1. **Validate:** Check JWT and Input (Zod).
2. **Lock:** Check Redis SETNX `vote:pollId:userId`. If exists -> 403 Forbidden.
3. **Queue:** Push payload to `vote-queue` (BullMQ).
4. **Respond:** Return 202 Accepted immediately.

The heavy lifting happens in `src/workers/vote.worker.ts`, which runs in a separate process/container.

### 3. Structured Logging & Observability

We moved away from `console.log` to Winston. Logs are structured as JSON for ingestion by tools like CloudWatch or ELK Stack.

```json
{
  "level": "info",
  "message": "Vote processed for poll EU2401",
  "timestamp": "2025-11-29 19:15:22",
  "service": "worker"
}
```

## Directory Structure

```
src/
├── config/         # Environment & DB connection logic
├── controllers/    # Route handlers (Input validation & Response)
├── middlewares/    # Auth (JWT) and Rate Limiting
├── models/         # Mongoose Schemas (Strictly Typed)
├── routes/         # Express Router definitions
├── services/       # Business logic layer
├── utils/          # Helpers (Logger, Redis Client, Queue)
├── workers/        # Background processors (The Consumer)
├── app.ts          # Express App setup (Middleware chains)
└── server.ts       # Entry point (Server listener)
```

## API Endpoints

### Auth

- `POST /api/v1/users/register` - Create account
- `POST /api/v1/users/login` - Get Access/Refresh tokens

### Polls

- `POST /api/v1/polls` - Create a new poll (Authenticated)
- `GET /api/v1/polls/:code` - Get poll metadata (Public)
- `GET /api/v1/polls/:code/results` - Get aggregate stats (Cached in Redis)

### Votes

- `POST /api/v1/votes/:code` - Cast a vote (High Throughput)

## Development

**Prerequisites:** Docker (for Redis/Mongo)

```bash
# 1. Install Dependencies
npm install

# 2. Start Infrastructure
docker-compose up -d mongo redis

# 3. Run Server (Terminal 1)
npm run dev

# 4. Run Worker (Terminal 2)
npm run worker:dev
```