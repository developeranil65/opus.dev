import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../lib/api';
import Navbar from '../components/Navbar';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

// New components
import { Label } from "../components/ui/Label";
import { Input } from "../components/ui/Input";
import { cn } from "../lib/utils";
// Removed IconBrandGithub, IconBrandGoogle

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/users/register', {
        username,
        email,
        password,
      });
      
      toast.success("Account created successfully");
      navigate("/login");

    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Registration failed";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-white">
      <Navbar />
      {/* --- MODIFIED THIS LINE --- */}
      <div className="flex-grow flex items-center justify-center p-4 pt-32">
        
        <div className="shadow-input mx-auto w-full max-w-md rounded-2xl p-4 md:p-8 bg-black border border-slate-800">
          <h2 className="text-xl font-bold text-neutral-200">
            Welcome to Opus Polls
          </h2>
          <p className="mt-2 max-w-sm text-sm text-neutral-300">
            Create an account to start building your polls
          </p>

          <form className="my-8" onSubmit={handleSubmit}>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username" 
                placeholder="tylerdurden" 
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </LabelInputContainer>
            
            <LabelInputContainer className="mb-4">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                placeholder="projectmayhem@fc.com" 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </LabelInputContainer>
            
            <LabelInputContainer className="mb-4">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                placeholder="••••••••" 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </LabelInputContainer>

            <button
              className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 mx-auto animate-spin" />
              ) : (
                <>
                  Sign up &rarr;
                  <BottomGradient />
                </>
              )}
            </button>
    
            <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-700 to-transparent" />
    
            {/* --- SOCIAL BUTTONS REMOVED --- */}

            {/* Link to Login */}
            <p className="text-center text-slate-400 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-cyan-500 hover:text-cyan-400">
                Log In
              </Link>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
}

// --- Helper components ---
const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};
 
const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};