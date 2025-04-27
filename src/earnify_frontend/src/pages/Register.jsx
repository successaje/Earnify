import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { toast } from 'react-hot-toast';
import { isAuthenticated, getCurrentPrincipal } from '../utils/ic';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: 'job_seeker',
    bio: '',
    skills: '',
    preferences: {
      preferredLocations: '',
      preferredJobTypes: '',
      preferredCategories: '',
      salaryExpectation: '',
      remotePreference: false,
      experienceLevel: ''
    },
    socialLinks: {
      linkedin: '',
      twitter: '',
      github: '',
      portfolio: ''
    }
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAuthenticatedWithII, setIsAuthenticatedWithII] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  // Check if user is authenticated with Internet Identity on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const auth = await isAuthenticated();
        setIsAuthenticatedWithII(auth);
        
        if (!auth) {
          toast.error('Please sign in with Internet Identity first');
          navigate('/login');
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        toast.error('Authentication check failed');
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('preferences.')) {
      const prefField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [prefField]: type === 'checkbox' ? checked : value
        }
      }));
    } else if (name.startsWith('social.')) {
      const socialField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    try {
      // First check authentication
      const isAuth = await isAuthenticated();
      if (!isAuth) {
        toast.error('Please authenticate first');
        navigate('/login');
        return;
      }
  
      // Get principal to verify
      const principal = await getCurrentPrincipal();
      if (principal.toString() === '2vxsx-fae') {
        toast.error('Invalid identity. Please login properly.');
        navigate('/login');
        return;
      }
  
      // Prepare user data
      const userData = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()),
        preferences: {
          ...formData.preferences,
          preferredLocations: formData.preferences.preferredLocations.split(',').map(l => l.trim()),
          preferredJobTypes: formData.preferences.preferredJobTypes.split(',').map(t => t.trim()),
          preferredCategories: formData.preferences.preferredCategories.split(',').map(c => c.trim()),
          salaryExpectation: parseFloat(formData.preferences.salaryExpectation) || 0
        }
      };
  
      // Call register function
      const result = await register(userData);
      
      if (result) {
        toast.success('Registration successful!');
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed');
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // If not authenticated with Internet Identity, show a message
  if (!isAuthenticatedWithII) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Authentication Required
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please sign in with Internet Identity to continue registration.
          </p>
          <div className="mt-6">
            <Link
              to="/login"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign in with Internet Identity
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Complete Your Profile
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          You've successfully authenticated with Internet Identity. Please complete your profile to continue.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <div className="mt-1">
                <select
                  id="role"
                  name="role"
                  required
                  value={formData.role}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="job_seeker">Job Seeker</option>
                  <option value="employer">Employer</option>
                  <option value="freelancer">Freelancer</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Bio
              </label>
              <div className="mt-1">
                <textarea
                  id="bio"
                  name="bio"
                  rows={3}
                  value={formData.bio}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
                Skills (comma-separated)
              </label>
              <div className="mt-1">
                <input
                  id="skills"
                  name="skills"
                  type="text"
                  value={formData.skills}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="e.g., JavaScript, React, Node.js"
                />
              </div>
            </div>

            <div>
              <label htmlFor="preferences.preferredLocations" className="block text-sm font-medium text-gray-700">
                Preferred Locations (comma-separated)
              </label>
              <div className="mt-1">
                <input
                  id="preferences.preferredLocations"
                  name="preferences.preferredLocations"
                  type="text"
                  value={formData.preferences.preferredLocations}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="e.g., New York, San Francisco, Remote"
                />
              </div>
            </div>

            <div>
              <label htmlFor="preferences.preferredJobTypes" className="block text-sm font-medium text-gray-700">
                Preferred Job Types (comma-separated)
              </label>
              <div className="mt-1">
                <input
                  id="preferences.preferredJobTypes"
                  name="preferences.preferredJobTypes"
                  type="text"
                  value={formData.preferences.preferredJobTypes}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="e.g., Full-time, Contract, Remote"
                />
              </div>
            </div>

            <div>
              <label htmlFor="preferences.preferredCategories" className="block text-sm font-medium text-gray-700">
                Preferred Categories (comma-separated)
              </label>
              <div className="mt-1">
                <input
                  id="preferences.preferredCategories"
                  name="preferences.preferredCategories"
                  type="text"
                  value={formData.preferences.preferredCategories}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="e.g., Web Development, Design, Marketing"
                />
              </div>
            </div>

            <div>
              <label htmlFor="preferences.salaryExpectation" className="block text-sm font-medium text-gray-700">
                Salary Expectation (USD)
              </label>
              <div className="mt-1">
                <input
                  id="preferences.salaryExpectation"
                  name="preferences.salaryExpectation"
                  type="number"
                  min="0"
                  value={formData.preferences.salaryExpectation}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="e.g., 75000"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="preferences.remotePreference"
                name="preferences.remotePreference"
                type="checkbox"
                checked={formData.preferences.remotePreference}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="preferences.remotePreference" className="ml-2 block text-sm text-gray-700">
                Open to remote work
              </label>
            </div>

            <div>
              <label htmlFor="preferences.experienceLevel" className="block text-sm font-medium text-gray-700">
                Experience Level
              </label>
              <div className="mt-1">
                <select
                  id="preferences.experienceLevel"
                  name="preferences.experienceLevel"
                  value={formData.preferences.experienceLevel}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Select experience level</option>
                  <option value="entry">Entry Level</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="senior">Senior</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
            </div>

            {/* Social Links Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Social Links</h3>
              
              <div>
                <label htmlFor="social.linkedin" className="block text-sm font-medium text-gray-700">
                  LinkedIn Profile
                </label>
                <div className="mt-1">
                  <input
                    id="social.linkedin"
                    name="social.linkedin"
                    type="url"
                    value={formData.socialLinks.linkedin}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="social.twitter" className="block text-sm font-medium text-gray-700">
                  Twitter Profile
                </label>
                <div className="mt-1">
                  <input
                    id="social.twitter"
                    name="social.twitter"
                    type="url"
                    value={formData.socialLinks.twitter}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="https://twitter.com/username"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="social.github" className="block text-sm font-medium text-gray-700">
                  GitHub Profile
                </label>
                <div className="mt-1">
                  <input
                    id="social.github"
                    name="social.github"
                    type="url"
                    value={formData.socialLinks.github}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="https://github.com/username"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="social.portfolio" className="block text-sm font-medium text-gray-700">
                  Portfolio Website
                </label>
                <div className="mt-1">
                  <input
                    id="social.portfolio"
                    name="social.portfolio"
                    type="url"
                    value={formData.socialLinks.portfolio}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="https://your-portfolio.com"
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {loading ? 'Creating Account...' : 'Complete Registration'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register; 