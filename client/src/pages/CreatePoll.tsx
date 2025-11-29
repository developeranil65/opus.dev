import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { Label } from '../components/ui/Label';
import { Input } from '../components/ui/Input';
import { Loader2, Plus, X } from 'lucide-react'; // Removed AlertCircle
import { cn } from '../lib/utils';
import { toast } from 'react-toastify'; // <-- 1. Import toast

// Helper component for the submit button gradient
const BottomGradient = () => (
  <>
    <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
    <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
  </>
);

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("flex w-full flex-col space-y-2", className)}>
    {children}
  </div>
);


export default function CreatePoll() {
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState([
    { text: '' },
    { text: '' },
  ]); // Start with 2 empty options
  const [isMultipleChoice, setIsMultipleChoice] = useState(false);
  const [isPublicResult, setIsPublicResult] = useState(true);
  
  // const [error, setError] = useState<string | null>(null); // <-- 2. Remove error state
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // --- Option Handlers ---

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index].text = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    if (options.length < 10) { // Limit to 10 options
      setOptions([...options, { text: '' }]);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) { // Must have at least 2 options
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  // --- Form Submission ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // setError(null); // <-- 3. Remove this

    // Filter out empty options
    const filteredOptions = options.filter(opt => opt.text.trim() !== '');

    if (filteredOptions.length < 2) {
      toast.error("Please provide at least two non-empty options."); // <-- 4. Use toast
      setLoading(false);
      return;
    }

    try {
      // Send data to the backend
      const response = await api.post('/polls', {
        title,
        options: filteredOptions, // Send only the valid options
        isMultipleChoice,
        isPublicResult,
      });

      // On success, redirect to the new poll's results page
      const newPollCode = response.data.data.pollCode;
      toast.success("Poll created successfully!"); // <-- 5. Use toast for success
      navigate(`/results/${newPollCode}`);

    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Failed to create poll.";
      toast.error(errorMsg); // <-- 6. Use toast for error
    } finally {
      setLoading(false); // <-- 7. Moved setLoading to finally
    }
  };


  return (
    <div className="w-full">
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-10">
        Create a New Poll
      </h1>
      
      <div className="w-full max-w-3xl mx-auto bg-slate-900 p-8 md:p-10 rounded-2xl border border-slate-700 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Poll Title */}
          <LabelInputContainer>
            <Label htmlFor="title" className="text-lg">Poll Question</Label>
            <Input 
              id="title"
              placeholder="What should we name our new mascot?" 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="text-lg" // Make text larger
            />
          </LabelInputContainer>

          {/* Poll Options */}
          <div>
            <Label className="text-lg">Options</Label>
            <div className="space-y-3 mt-2">
              {options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    type="text"
                    placeholder={`Option ${index + 1}`}
                    value={option.text}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="flex-grow"
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="p-2 text-slate-400 hover:text-red-500"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
              {options.length < 10 && (
                <button
                  type="button"
                  onClick={addOption}
                  className="flex items-center gap-2 text-cyan-500 hover:text-cyan-400 font-medium"
                >
                  <Plus className="h-5 w-5" />
                  Add Option
                </button>
              )}
            </div>
          </div>

          {/* Poll Settings */}
          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-medium">Settings</h3>
            <label className="flex items-center gap-3 p-4 bg-slate-800 rounded-lg border border-slate-700 cursor-pointer">
              <input
                type="checkbox"
                className="h-5 w-5 accent-cyan-500"
                checked={isMultipleChoice}
                onChange={(e) => setIsMultipleChoice(e.target.checked)}
              />
              <div>
                <span className="text-white font-medium">Allow Multiple Choices</span>
                <p className="text-slate-400 text-sm">Voters can select more than one option.</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 bg-slate-800 rounded-lg border border-slate-700 cursor-pointer">
              <input
                type="checkbox"
                className="h-5 w-5 accent-cyan-500"
                checked={isPublicResult}
                onChange={(e) => setIsPublicResult(e.target.checked)}
              />
              <div>
                <span className="text-white font-medium">Public Results</span>
                <p className="text-slate-400 text-sm">
                  {isPublicResult 
                    ? "Anyone with the link can see the results." 
                    : "Only you (the creator) can see the results."
                  }
                </p>
              </div>
            </label>
          </div>

          {/* Error Message */}
          {/* <-- 8. REMOVED INLINE ERROR BLOCK --> */}

          {/* Submit Button */}
          <button
            className="group/btn relative block h-12 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset] text-lg"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-6 w-6 mx-auto animate-spin" />
            ) : (
              <>
                Create Poll &rarr;
                <BottomGradient />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}