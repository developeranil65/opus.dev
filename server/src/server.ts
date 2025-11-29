import connectDB from "./db/connect.db";
import dotenv from "dotenv";
import { app } from "./app";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { connectRedis, subClient } from "./utils/redis";
import { Logger } from "./utils/logger";

dotenv.config({ path: "./.env" });

const server = createServer(app);
const wss = new WebSocketServer({ server });

// Map<pollCode, Set<WebSocket>>
const pollRooms = new Map<string, Set<WebSocket>>();

interface ExtendedWebSocket extends WebSocket {
    pollCode?: string;
}

// --- REDIS SUBSCRIBER SETUP ---
async function setupSubscribers() {
  Logger.info("Setting up Redis Subscriber...");
  
  await subClient.subscribe('poll_updates', (message) => {
    try {
      const { pollCode, data } = JSON.parse(message);
      
      const clients = pollRooms.get(pollCode);
      
      if (clients && clients.size > 0) {
        const strData = JSON.stringify(data);
        
        for (const client of clients) {
          if (client.readyState === 1) { // 1 = OPEN
            client.send(strData);
          }
        }
      }
    } catch (err) {
      Logger.error("Error processing Redis message:", err);
    }
  });
}

// --- WEBSOCKET CONNECTION HANDLER ---
wss.on("connection", (ws: ExtendedWebSocket) => {
  Logger.info("New Client Connected via WebSocket");

  ws.on("message", (msg: string) => {
    try {
      const data = JSON.parse(msg);

      if (data.type === "JOIN_POLL" && data.pollCode) {
        const code = data.pollCode;

        if (!pollRooms.has(code)) {
          pollRooms.set(code, new Set());
        }
        pollRooms.get(code)?.add(ws);

        ws.pollCode = code; 
        Logger.info(`Client joined room: ${code}`);
      }
    } catch (err) {
      Logger.error("Invalid WS message", err);
    }
  });

  ws.on("close", () => {
    if (ws.pollCode && pollRooms.has(ws.pollCode)) {
      const room = pollRooms.get(ws.pollCode);
      if (room) {
        room.delete(ws);
        if (room.size === 0) pollRooms.delete(ws.pollCode);
        Logger.info(`Client left room: ${ws.pollCode}`);
      }
    }
  });
});

const startServer = async () => {
  try {
    await connectDB();
    await connectRedis(); 
    await setupSubscribers(); 

    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      Logger.info(`Server running on http://localhost:${PORT}`);
    });

    server.on("error", (error) => {
      Logger.error("Server Error", error);
      throw error;
    });
  } catch (error) {
    Logger.error("Startup failed", error);
    process.exit(1);
  }
};

startServer();