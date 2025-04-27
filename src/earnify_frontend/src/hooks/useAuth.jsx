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
  updateUser,
  initialize
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
        // Initialize the auth client, agent, and actor
        await initialize();
        
        const authenticated = await isAuthenticated();
        if (authenticated) {
          const principal = await getCurrentPrincipal();
          
          // Get user data from backend
          const result = await getUser(principal);
          
          if ('ok' in result) {
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
      
      // Initialize the auth client, agent, and actor
      await initialize();
      
      // Start the Internet Identity login flow
      await loginWithII();
      
      // Get the authenticated principal
      const principal = await getCurrentPrincipal();
      
      // Get user data from backend
      const result = await getUser(principal);
      
      if ('ok' in result) {
        setUser(result.ok);
        return result.ok;
      } else {
        // If user doesn't exist yet, store the principal and redirect to registration
        console.log('User not found in backend, redirecting to registration');
        localStorage.setItem('pendingRegistrationPrincipal', principal.toText());
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
      
      // Initialize the auth client, agent, and actor
      await initialize();
      
      // Get the current principal
      const principal = await getCurrentPrincipal();
      const principalText = principal.toText();
      
      // Check if the principal is anonymous
      if (principalText === '2vxsx-fae') {
        throw new Error('Authentication failed. Please login with Internet Identity before registering.');
      }
      
      console.log('User authenticated with principal:', principalText);
      
      // Check if user already exists
      const userResult = await getUser(principal);
      
      if ('ok' in userResult) {
        // User already exists, return it
        setUser(userResult.ok);
        localStorage.removeItem('pendingRegistrationPrincipal');
        return userResult.ok;
      }
      
      // Initialize user data with default values
      const completeUserData = {
        ...userData,
        socialLinks: userData.socialLinks || {
          linkedin: '',
          twitter: '',
          github: '',
          portfolio: ''
        },
        proofOfWork: userData.proofOfWork || [],
        preferences: {
          preferredLocations: userData.preferences?.preferredLocations || [],
          preferredJobTypes: userData.preferences?.preferredJobTypes || [],
          preferredCategories: userData.preferences?.preferredCategories || [],
          salaryExpectation: userData.preferences?.salaryExpectation || 0.0,
          remotePreference: userData.preferences?.remotePreference || false,
          experienceLevel: userData.preferences?.experienceLevel || 'entry'
        }
      };
      
      console.log('Attempting to create user with data:', completeUserData);
      
      // Then register the user in the backend with complete data
      const result = await createUser(completeUserData);
      
      console.log('Create user result:', result);
      
      if (result && 'ok' in result) {
        console.log('User created successfully, setting user state');
        setUser(result.ok);
        // Clear the pending registration principal
        localStorage.removeItem('pendingRegistrationPrincipal');
        return result.ok;
      } else {
        console.error('Unexpected result format:', result);
        throw new Error('Failed to create user: Unexpected response format');
      }
    } catch (err) {
      console.error('Registration failed:', err);
      setError(err.message || 'Registration failed. Please try again.');
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
      
      // Initialize the auth client, agent, and actor
      await initialize();
      
      // Update user in backend
      const result = await updateUser(profileData);
      
      if ('ok' in result) {
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

  // Refresh user data
  const refreshUser = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Initialize the auth client, agent, and actor
      await initialize();
      
      const authenticated = await isAuthenticated();
      if (!authenticated) {
        setUser(null);
        return null;
      }
      
      const principal = await getCurrentPrincipal();
      const result = await getUser(principal);
      
      if ('ok' in result) {
        setUser(result.ok);
        return result.ok;
      } else {
        console.error('Failed to get user data:', result.err);
        setError('Failed to get user data');
        return null;
      }
    } catch (err) {
      console.error('Error refreshing user data:', err);
      setError('Failed to refresh user data');
      return null;
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
    updateProfile,
    refreshUser
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