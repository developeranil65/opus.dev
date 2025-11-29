import connectDB from "./db/connect.db.js";
import dotenv from "dotenv";
import { app } from "./app.js";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { connectRedis, subClient } from "./utils/redis.js";

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
  console.log("🎧 Setting up Redis Subscriber...");
  
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
      console.error("❌ Error processing Redis message:", err);
    }
  });
}

// --- WEBSOCKET CONNECTION HANDLER ---
wss.on("connection", (ws: ExtendedWebSocket) => {
  console.log("🔌 New Client Connected via WebSocket");

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
        console.log(`✅ Client joined room: ${code}`);
      }
    } catch (err) {
      console.error("Invalid WS message", err);
    }
  });

  ws.on("close", () => {
    if (ws.pollCode && pollRooms.has(ws.pollCode)) {
      const room = pollRooms.get(ws.pollCode);
      if (room) {
        room.delete(ws);
        if (room.size === 0) pollRooms.delete(ws.pollCode);
        console.log(`👋 Client left room: ${ws.pollCode}`);
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
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

    server.on("error", (error) => {
      console.error("Server Error", error);
      throw error;
    });
  } catch (error) {
    console.error("Startup failed", error);
    process.exit(1);
  }
};

startServer();