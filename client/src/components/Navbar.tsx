import { Link, useNavigate } from 'react-router-dom';
import { Layers, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // <-- Import our auth hook

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth(); // <-- Get auth state
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout(); // This will now also redirect
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-20 bg-slate-950/70 backdrop-blur-md border-b border-slate-800">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        
    {/* Logo / Brand */}
    <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2 text-xl font-bold text-white">
      {/* The path starts from the public folder root */}
      <img 
        src="/logo.png" 
        alt="Opus Polls Logo" 
        className="h-6 w-6 text-cyan-500" // Use your existing class names for styling
      />
      OPUS
    </Link>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            // --- LOGGED IN STATE ---
            <>
              <span className="text-slate-300 font-medium hidden sm:block">
                Hi, {user?.username}
              </span>
              <button
                onClick={() => navigate('/dashboard')} // Simple button to go to dashboard
                className="text-slate-300 font-medium hover:text-cyan-400 transition-colors flex items-center gap-2"
                title="Your Dashboard"
              >
                <UserIcon className="h-5 w-5" />
              </button>
              <button
                onClick={handleLogout}
                className="bg-slate-700 text-white font-medium px-5 py-2.5 rounded-lg hover:bg-slate-600 transition-colors"
              >
                Log Out
              </button>
            </>
          ) : (
            // --- LOGGED OUT STATE ---
            <>
              <Link 
                to="/login" 
                className="text-slate-300 font-medium hover:text-cyan-400 transition-colors"
              >
                Log In
              </Link>
              <Link 
                to="/register" 
                className="bg-cyan-500 text-slate-900 font-medium px-5 py-2.5 rounded-lg hover:bg-cyan-400 transition-shadow shadow-sm hover:shadow-cyan-500/30"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}