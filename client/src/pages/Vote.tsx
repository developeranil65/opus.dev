import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api'; // Our new axios instance
import Navbar from '../components/Navbar';
import { Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify'; // <-- 1. Import toast

// Define a TypeScript type for the poll data we expect
// Based on poll.controller.js -> getPollByCode
interface Poll {
  _id: string;
  title: string;
  options: { text: string }[]; // The backend strips out votes
  pollCode: string;
  isMultipleChoice: boolean;
  isPublicResult: boolean;
  expiresAt: string | null;
}

export default function Vote() {
  const { pollCode } = useParams(); // Get pollCode from the URL
  const navigate = useNavigate(); // To redirect after voting

  // State
  const [poll, setPoll] = useState<Poll | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Data Fetching ---
  useEffect(() => {
    const fetchPoll = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch poll data from our backend
        const response = await api.get(`/polls/${pollCode}`);
        setPoll(response.data.data);
      } catch (err: any) {
        // Handle errors (e.g., 404 Not Found)
        const errorMsg = err.response?.data?.message || "Failed to fetch poll.";
        setError(errorMsg);
        // We keep setError here because the "Error State" (if !poll) is important
      } finally {
        setLoading(false);
      }
    };

    if (pollCode) {
      fetchPoll();
    }
  }, [pollCode]); // Re-run if pollCode changes

  // --- Event Handlers ---
  const handleOptionChange = (optionText: string) => {
    if (!poll) return;

    if (poll.isMultipleChoice) {
      // Checkbox logic
      setSelectedOptions((prev) =>
        prev.includes(optionText)
          ? prev.filter((opt) => opt !== optionText) // Uncheck
          : [...prev, optionText] // Check
      );
    } else {
      // Radio button logic
      setSelectedOptions([optionText]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOptions.length === 0) {
      toast.warn("Please select at least one option."); // <-- 2. Use toast
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      
      // Send the vote to our backend
      //
      await api.post(`/votes/${pollCode}/vote`, {
        selectedOptions: selectedOptions, // Backend expects this exact object key
      });

      // Success! Redirect to the results page
      toast.success("Vote submitted successfully!"); // <-- 3. Use toast
      navigate(`/results/${pollCode}`);

    } catch (err: any) {
      // Handle voting errors (e.g., "Poll has expired", "Already voted")
      const errorMsg = err.response?.data?.message || "Failed to submit vote.";
      setError(errorMsg); // Keep inline error for context
      toast.error(errorMsg); // <-- 4. Also show toast
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Rendering Logic ---

  // 1. Loading State
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-950 text-white">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-cyan-500" />
        </div>
      </div>
    );
  }

  // 2. Error State (if poll failed to load)
  if (error && !poll) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-950 text-white">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
          <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
          <h1 className="text-3xl font-bold mb-2">Error</h1>
          <p className="text-lg text-slate-400">{error}</p>
        </div>
      </div>
    );
  }

  // 3. Success State (Poll Loaded)
  if (poll) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-950 text-white">
        <Navbar />
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="w-full max-w-2xl">
            
            <form onSubmit={handleSubmit} className="bg-slate-900 p-8 md:p-12 rounded-2xl shadow-2xl border border-slate-700">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{poll.title}</h1>
              <p className="text-slate-400 mb-8">
                {poll.isMultipleChoice
                  ? "Select one or more options."
                  : "Select one option."}
              </p>

              {/* Dynamic Options List */}
              <div className="space-y-5 mb-10">
                {poll.options.map((option) => (
                  <label
                    key={option.text}
                    className="flex items-center p-5 bg-slate-800 rounded-lg cursor-pointer transition-all hover:bg-slate-700 border border-slate-700 has-[:checked]:bg-indigo-900 has-[:checked]:border-cyan-500"
                  >
                    <input
                      type={poll.isMultipleChoice ? "checkbox" : "radio"}
                      name="pollOption"
                      value={option.text}
                      checked={selectedOptions.includes(option.text)}
                      onChange={() => handleOptionChange(option.text)}
                      className="h-6 w-6 accent-cyan-500 bg-slate-700 border-slate-600 rounded"
                    />
                    <span className="ml-4 text-lg font-medium">{option.text}</span>
                  </label>
                ))}
              </div>

              {/* Submission Error Message (Kept for inline errors) */}
              {error && (
                <div className="flex items-center p-3 mb-6 bg-red-900/50 border border-red-700 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
                  <p className="text-red-400">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || selectedOptions.length === 0}
                className="w-full bg-cyan-500 text-slate-900 font-bold py-4 px-6 rounded-lg text-lg transition-all
                           hover:bg-cyan-400
                           disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <Loader2 className="h-6 w-6 mx-auto animate-spin" />
                ) : (
                  'Submit Vote'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return null; // Should be covered by loading/error states
}