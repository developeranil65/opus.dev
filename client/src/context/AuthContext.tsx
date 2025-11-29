import { createContext, useContext, useState, type ReactNode, useEffect } from 'react';
import api from '../lib/api';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface User {
  _id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (data: any) => Promise<User>; // Simplified, expand later
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is already logged in on page load
  useEffect(() => {
    const checkUser = async () => {
      try {
        // We use the refresh token endpoint as a "me" endpoint
        // It will either return new tokens (if logged in) or fail (if not)
        const response = await api.post('/users/refresh-token');
        // If it succeeds, we need to get user data.
        // For now, we'll assume a login is needed.
        // A better backend would have a /me endpoint.
        
        // This is a placeholder. We'll build login/register next.
        // For now, we'll just set loading to false.
        
      } catch (error) {
        console.error("Not logged in");
      } finally {
        setLoading(false);
      }
    };
    // checkUser();
    // For now, let's skip the auto-login check to build the page
    setLoading(false);
  }, []);

  const login = async (data: any) => {
    const response = await api.post('/users/login', data);
    setUser(response.data.data.user);
    return response.data.data.user;
  };

  const logout = async () => {
    try {
      await api.post('/users/logout');
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setUser(null);
      navigate('/'); // <-- 3. Add this redirect
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-950">
        <Loader2 className="h-12 w-12 animate-spin text-cyan-500" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ 
        user, 
        isAuthenticated: !!user, 
        login, 
        logout,
        loading 
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

