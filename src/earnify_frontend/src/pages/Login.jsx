import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { toast } from 'react-hot-toast';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the redirect path from location state or default to home
  const from = location.state?.from?.pathname || '/';

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Call the login function from useAuth
      const user = await login();
      
      // If user is null, it means they need to register
      // The useAuth hook will handle the redirect to /register
      if (user === null) {
        toast.info('Please complete your profile to continue.');
        return;
      }
      
      // Show success message
      toast.success('Login successful!');
      
      // Redirect to the page the user was trying to access
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to login. Please try again.');
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in with Internet Identity
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          This is the first step to access the platform. If you're new, you'll be prompted to complete your profile after signing in.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <div className="mt-6">
            <button
              onClick={handleLogin}
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {loading ? 'Signing in...' : 'Sign in with Internet Identity'}
            </button>
          </div>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">About Internet Identity</span>
              </div>
            </div>
            
            <div className="mt-6 text-sm text-gray-600">
              <p>
                Internet Identity is a secure authentication service for the Internet Computer. It allows you to sign in to dapps without creating a new account for each one.
              </p>
              <p className="mt-2">
                If you don't have an Internet Identity account yet, you'll be prompted to create one during the sign-in process.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 