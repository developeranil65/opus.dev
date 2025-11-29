import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../lib/api';
import Navbar from '../components/Navbar';
import { usePollWebSocket, type PollResultOption } from '../hooks/usePollWebSocket';
import { Loader2, AlertCircle, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';

// Define the shape of the initial data from the HTTP request
//
interface PollResults {
  title: string;
  totalVotes: number;
  results: (PollResultOption & { percentage: string })[]; // Initial fetch includes percentage
}

export default function Results() {
  const { pollCode } = useParams();

  // --- State ---
  const [poll, setPoll] = useState<PollResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // --- Custom WebSocket Hook ---
  // This gives us live data once connected
  const { liveResults } = usePollWebSocket(pollCode || '');

  // --- Initial Data Fetch (HTTP) ---
  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch initial results from the API
        //
        const response = await api.get(`/polls/${pollCode}/results`);
        setPoll(response.data.data);
      } catch (err: any) {
        // Handle errors (e.g., 403 Private Poll)
        //
        const errorMsg = err.response?.data?.message || "Failed to fetch poll results.";
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    if (pollCode) {
      fetchResults();
    }
  }, [pollCode]);

  
  // --- Live Data Sync ---
  // This effect checks if the websocket has sent new data
  // and updates our poll state if it has.
  useEffect(() => {
    if (liveResults) {
      // Recalculate total votes and percentages from the live data
      const newTotalVotes = liveResults.reduce((sum, opt) => sum + opt.votes, 0);
      const newResultsWithPercentages = liveResults.map(opt => ({
        ...opt,
        percentage: newTotalVotes > 0 
          ? ((opt.votes / newTotalVotes) * 100).toFixed(1) 
          : "0.0",
      }));

      // Update the poll state
      setPoll((prevPoll) => ({
        ...prevPoll!,
        title: prevPoll?.title || 'Poll Results', // Keep old title
        totalVotes: newTotalVotes,
        results: newResultsWithPercentages,
      }));
    }
  }, [liveResults]); // This runs every time `liveResults` changes


  // --- Render Functions ---

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-cyan-500" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
          <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
          <h1 className="text-3xl font-bold mb-2">Error</h1>
          <p className="text-lg text-slate-400">{error}</p>
          {error.includes("private") && (
            <Link 
              to={`/login?from=/results/${pollCode}`}
              className="mt-6 bg-cyan-500 text-slate-900 font-bold py-3 px-6 rounded-lg text-lg"
            >
              Login to view
            </Link>
          )}
        </div>
      );
    }

    if (poll) {
      return (
        <div className="w-full max-w-3xl">
          <div className="mb-8">
            <p className="text-lg text-slate-400">Live Results</p>
            <h1 className="text-4xl md:text-5xl font-bold">{poll.title}</h1>
          </div>

          <div className="space-y-4">
            {poll.results.map((option) => (
              <PollResultBar key={option.text} option={option} />
            ))}
          </div>

          <p className="text-2xl font-bold text-center mt-10">
            Total Votes: {poll.totalVotes}
          </p>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-white">
      <Navbar />
      <div className="flex-grow flex items-center justify-center p-4 pt-32">
        {renderContent()}
      </div>
    </div>
  );
}

// --- Reusable Result Bar Component ---
const PollResultBar = ({ option }: { option: PollResultOption & { percentage: string } }) => {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-lg font-medium">{option.text}</span>
          <span className="text-xl font-bold">{option.percentage}%</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-4">
          <motion.div
            className="bg-cyan-500 h-4 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${option.percentage}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
        <span className="text-sm text-slate-400 mt-1 block">
          {option.votes} {option.votes === 1 ? 'vote' : 'votes'}
        </span>
      </div>
    </div>
  );
};