import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

const Profile = () => {
  const { user, updateProfile, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    bio: '',
    skills: '',
    role: 'job_seeker',
    preferences: {
      preferredLocations: '',
      preferredJobTypes: '',
      preferredCategories: '',
      salaryExpectation: '',
      remotePreference: false,
      experienceLevel: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Initialize form data with user data when available
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || '',
        skills: user.skills ? user.skills.join(', ') : '',
        role: user.role || 'job_seeker',
        preferences: {
          preferredLocations: user.preferences?.preferredLocations ? user.preferences.preferredLocations.join(', ') : '',
          preferredJobTypes: user.preferences?.preferredJobTypes ? user.preferences.preferredJobTypes.join(', ') : '',
          preferredCategories: user.preferences?.preferredCategories ? user.preferences.preferredCategories.join(', ') : '',
          salaryExpectation: user.preferences?.salaryExpectation || '',
          remotePreference: user.preferences?.remotePreference || false,
          experienceLevel: user.preferences?.experienceLevel || ''
        }
      });
    }
  }, [user]);

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
    setSuccess('');

    try {
      // Prepare data for update
      const updateData = {
        ...formData,
        skills: formData.skills.split(',').map(skill => skill.trim()),
        preferences: {
          ...formData.preferences,
          preferredLocations: formData.preferences.preferredLocations.split(',').map(loc => loc.trim()),
          preferredJobTypes: formData.preferences.preferredJobTypes.split(',').map(type => type.trim()),
          preferredCategories: formData.preferences.preferredCategories.split(',').map(cat => cat.trim()),
          salaryExpectation: parseFloat(formData.preferences.salaryExpectation) || 0
        }
      };

      await updateProfile(updateData);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      console.error('Profile update error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">Please log in to view your profile</h2>
              <p className="mt-2 text-sm text-gray-600">
                You need to be logged in to access your profile.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
            <p className="mt-1 text-sm text-gray-500">
              Update your profile information and preferences.
            </p>
          </div>
          
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
              
              {success && (
                <div className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                  <span className="block sm:inline">{success}</span>
                </div>
              )}
              
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="username"
                      id="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-2">
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
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-2">
                  <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
                    Skills (comma separated)
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="skills"
                      id="skills"
                      value={formData.skills}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
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
                      value={formData.role}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="job_seeker">Job Seeker</option>
                      <option value="employer">Employer</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Job Preferences</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Set your preferences for job searches and recommendations.
                </p>
                
                <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="preferences.preferredLocations" className="block text-sm font-medium text-gray-700">
                      Preferred Locations (comma separated)
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="preferences.preferredLocations"
                        id="preferences.preferredLocations"
                        value={formData.preferences.preferredLocations}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label htmlFor="preferences.preferredJobTypes" className="block text-sm font-medium text-gray-700">
                      Preferred Job Types (comma separated)
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="preferences.preferredJobTypes"
                        id="preferences.preferredJobTypes"
                        value={formData.preferences.preferredJobTypes}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label htmlFor="preferences.preferredCategories" className="block text-sm font-medium text-gray-700">
                      Preferred Categories (comma separated)
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="preferences.preferredCategories"
                        id="preferences.preferredCategories"
                        value={formData.preferences.preferredCategories}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="preferences.salaryExpectation" className="block text-sm font-medium text-gray-700">
                      Salary Expectation
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        name="preferences.salaryExpectation"
                        id="preferences.salaryExpectation"
                        value={formData.preferences.salaryExpectation}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
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
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      >
                        <option value="">Select experience level</option>
                        <option value="entry">Entry Level</option>
                        <option value="mid">Mid Level</option>
                        <option value="senior">Senior Level</option>
                        <option value="expert">Expert</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="sm:col-span-2">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="preferences.remotePreference"
                          name="preferences.remotePreference"
                          type="checkbox"
                          checked={formData.preferences.remotePreference}
                          onChange={handleChange}
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="preferences.remotePreference" className="font-medium text-gray-700">
                          Prefer remote work
                        </label>
                        <p className="text-gray-500">I'm interested in remote job opportunities</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-5">
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 