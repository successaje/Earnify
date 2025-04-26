import { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Principal } from '@dfinity/principal';
import { 
  loginWithII, 
  logoutFromII, 
  isAuthenticated, 
  getCurrentPrincipal,
  createUser,
  getUser,
  updateUser
} from '../utils/ic';

// Create a context for authentication
const AuthContext = createContext(null);

// Provider component that wraps the app and makes auth object available to any child component that calls useAuth()
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check if user is already authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = await isAuthenticated();
        if (authenticated) {
          const principal = await getCurrentPrincipal();
          
          // Get user data from backend
          const result = await getUser(principal);
          
          if (result.ok) {
            setUser(result.ok);
          } else {
            console.error('Failed to get user data:', result.err);
            setError('Failed to get user data');
          }
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        setError('Authentication check failed');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function using Internet Identity
  const login = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Start the Internet Identity login flow
      await loginWithII();
      
      // Get the authenticated principal
      const principal = await getCurrentPrincipal();
      
      // Get user data from backend
      const result = await getUser(principal);
      
      if (result.ok) {
        setUser(result.ok);
        return result.ok;
      } else {
        // If user doesn't exist yet, redirect to registration
        console.log('User not found in backend, redirecting to registration');
        navigate('/register');
        return null;
      }
    } catch (err) {
      console.error('Login failed:', err);
      setError('Login failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function - with Internet Identity, registration happens during login
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      // First authenticate with Internet Identity
      const existingUser = await login();
      
      // If user already exists, return it
      if (existingUser) {
        return existingUser;
      }
      
      // Then register the user in the backend
      const result = await createUser(userData);
      
      if (result.ok) {
        setUser(result.ok);
        return result.ok;
      } else {
        throw new Error(result.err);
      }
    } catch (err) {
      console.error('Registration failed:', err);
      setError('Registration failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await logoutFromII();
      setUser(null);
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
      setError('Logout failed. Please try again.');
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Update user in backend
      const result = await updateUser(profileData);
      
      if (result.ok) {
        setUser(result.ok);
        return result.ok;
      } else {
        throw new Error(result.err);
      }
    } catch (err) {
      console.error('Profile update failed:', err);
      setError('Profile update failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Value object that will be passed to consumers of this context
  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook for child components to get the auth object and re-render when it changes
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth; 