import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PollCard, { type Poll } from '../components/PollCard.tsx';
import api from '../lib/api.ts';
import { Loader2, AlertCircle, Plus } from 'lucide-react';
import { toast } from 'react-toastify'; // <-- 1. Import toast

export default function Dashboard() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyPolls = async () => {
      try {
        setLoading(true);
        const response = await api.get('/polls/my-polls');
        setPolls(response.data.data);
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || "Failed to fetch your polls.";
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };
    fetchMyPolls();
  }, []);

  const handleDelete = async (pollCode: string) => {
    if (!window.confirm("Are you sure you want to delete this poll? This action cannot be undone.")) {
      return;
    }
    try {
      await api.delete(`/polls/${pollCode}`);
      setPolls((prevPolls) => prevPolls.filter((poll) => poll.pollCode !== pollCode));
      toast.success("Poll deleted successfully!"); // <-- 2. Use toast for success
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Failed to delete poll.";
      toast.error(errorMsg); // <-- 3. Use toast for error
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex-grow flex items-center justify-center pt-16">
          <Loader2 className="h-12 w-12 animate-spin text-cyan-500" />
        </div>
      );
    }
    if (error) {
      return (
        <div className="flex-grow flex flex-col items-center justify-center text-center p-4 pt-16">
          <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
          <h1 className="text-3xl font-bold mb-2 text-white">Error</h1>
          <p className="text-lg text-slate-400">{error}</p>
        </div>
      );
    }
    if (polls.length === 0) {
      return (
        <div className="mt-16 flex justify-center">
          <div className="w-full max-w-lg text-center bg-slate-900 p-10 rounded-2xl border border-slate-700 shadow-xl">
            <h2 className="text-3xl font-bold text-white mb-4">No polls found</h2>
            <p className="text-lg text-slate-400 mb-8">Get started by creating your first poll.</p>
            <Link
              to="/create-poll"
              className="inline-flex items-center gap-2 bg-cyan-500 text-slate-900 font-bold py-3 px-6 rounded-lg text-lg transition-all hover:bg-cyan-400"
            >
              <Plus className="h-6 w-6" />
              Create Poll
            </Link>
          </div>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {polls.map((poll) => (
          <PollCard key={poll._id} poll={poll} onDelete={handleDelete} />
        ))}
      </div>
    );
  };

  // --- RETURN THE CONTENT, NOT THE FULL PAGE ---
  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 md:mb-0">
          My Polls
        </h1>
        <Link
          to="/create-poll"
          className="flex items-center justify-center gap-2 bg-cyan-500 text-slate-900 font-bold py-3 px-5 rounded-lg text-lg transition-all hover:bg-cyan-400"
        >
          <Plus className="h-6 w-6" />
          Create New Poll
        </Link>
      </div>
      {renderContent()}
    </div>
  );
  // --- END OF NEW RETURN ---
}