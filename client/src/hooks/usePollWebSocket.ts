import { useState, useEffect, useRef } from 'react';

// Get WebSocket URL from environment
const WS_URL = import.meta.env.VITE_WS_URL;

// Define the shape of a single result option
export interface PollResultOption {
  text: string;
  votes: number;
  percentage?: string; // Percentage is optional as we might recalculate
}

// Define the shape of the data from the WebSocket
interface WebSocketUpdate {
  type: 'VOTE_UPDATE';
  pollCode: string;
  results: PollResultOption[];
}

export const usePollWebSocket = (pollCode: string) => {
  // Store the latest results in state
  const [liveResults, setLiveResults] = useState<PollResultOption[] | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  
  // Use a ref to hold the WebSocket object
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!pollCode) return;

    // Create a new WebSocket connection
    ws.current = new WebSocket(WS_URL);

    ws.current.onopen = () => {
      console.log('WebSocket Connected');
      setIsConnected(true);
      
      // Once connected, join the specific poll room
      //
      ws.current?.send(JSON.stringify({
        type: 'JOIN_POLL',
        pollCode: pollCode,
      }));
    };

    ws.current.onmessage = (event) => {
      try {
        const data: WebSocketUpdate = JSON.parse(event.data);
        
        // Listen for the 'VOTE_UPDATE' message
        //
        if (data.type === 'VOTE_UPDATE' && data.pollCode === pollCode) {
          console.log('Live vote update received:', data.results);
          setLiveResults(data.results); // Update our state with the new results
        }
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
      }
    };

    ws.current.onclose = () => {
      console.log('WebSocket Disconnected');
      setIsConnected(false);
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    // Cleanup function to close the connection when the component unmounts
    return () => {
      ws.current?.close();
    };
  }, [pollCode]); // Re-connect if the pollCode changes

  // Return the live results and connection status
  return { liveResults, isConnected };
};