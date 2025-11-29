import { useState, useEffect, useRef } from 'react';

export interface PollResultOption {
  text: string;
  votes: number;
  percentage?: string;
}

interface WebSocketUpdate {
  type: 'VOTE_UPDATE';
  pollCode: string;
  results: PollResultOption[];
}

// Helper to determine the correct WebSocket URL dynamically
const getWebSocketUrl = () => {
  // 1. If explicitly set in .env (e.g. Local Dev), use it
  if (import.meta.env.VITE_WS_URL) {
    return import.meta.env.VITE_WS_URL;
  }
  
  // 2. Production Fallback (Docker/Nginx)
  // Automatically uses the current domain (localhost) and appends /ws
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = window.location.host; 
  return `${protocol}//${host}/ws`;
};

export const usePollWebSocket = (pollCode: string) => {
  const [liveResults, setLiveResults] = useState<PollResultOption[] | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  
  const latestDataRef = useRef<PollResultOption[] | null>(null);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Prevent connecting if pollCode is missing or literally "undefined" string
    if (!pollCode || pollCode === 'undefined') return;

    const wsUrl = getWebSocketUrl();
    console.log(`🔌 Connecting WebSocket to: ${wsUrl}`);

    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log('WebSocket Connected');
      setIsConnected(true);
      ws.current?.send(JSON.stringify({
        type: 'JOIN_POLL',
        pollCode: pollCode,
      }));
    };

    ws.current.onmessage = (event) => {
      try {
        const data: WebSocketUpdate = JSON.parse(event.data);
        if (data.type === 'VOTE_UPDATE' && data.pollCode === pollCode) {
          latestDataRef.current = data.results;
        }
      } catch (error) {
        console.error("WS Parse Error:", error);
      }
    };

    ws.current.onclose = () => {
      console.log('WebSocket Disconnected');
      setIsConnected(false);
    };

    // UI Throttle (60fps-ish or 1s updates)
    const uiInterval = setInterval(() => {
      if (latestDataRef.current) {
        setLiveResults(latestDataRef.current);
      }
    }, 1000);

    return () => {
      clearInterval(uiInterval);
      ws.current?.close();
    };
  }, [pollCode]);

  return { liveResults, isConnected };
};