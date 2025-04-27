import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { updateUser, updateSocialLinks, getUser, removeProofOfWork, addProofOfWork } from '../utils/ic';
import { FaLinkedin, FaTwitter, FaGithub, FaGlobe, FaPlus, FaTrash } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

function Profile() {
  const navigate = useNavigate();
  const { user, loading: authLoading, error: authError, updateProfile, refreshUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    bio: '',
    skills: [],
    experience: [],
    education: [],
    role: '',
    preferences: {
      preferredLocations: [],
      preferredJobTypes: [],
      preferredCategories: [],
      salaryExpectation: 0.0,
      remotePreference: false,
      experienceLevel: 'entry'
    },
    socialLinks: {
      linkedin: '',
      twitter: '',
      github: '',
      portfolio: ''
    },
    proofOfWork: []
  });
  const [newExperience, setNewExperience] = useState({
    title: '',
    company: '',
    description: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
  });
  const [newEducation, setNewEducation] = useState({
    institution: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
  });
  const [newSkill, setNewSkill] = useState('');
  const [newWork, setNewWork] = useState({
    title: '',
    description: '',
    url: '',
    type: 'project'
  });
  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [showEducationForm, setShowEducationForm] = useState(false);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || '',
        skills: user.skills || [],
        experience: user.experience || [],
        education: user.education || [],
        role: user.role || '',
        preferences: {
          preferredLocations: user.preferences?.preferredLocations || [],
          preferredJobTypes: user.preferences?.preferredJobTypes || [],
          preferredCategories: user.preferences?.preferredCategories || [],
          salaryExpectation: user.preferences?.salaryExpectation || 0.0,
          remotePreference: user.preferences?.remotePreference || false,
          experienceLevel: user.preferences?.experienceLevel || 'entry'
        },
        socialLinks: user.socialLinks || {
          linkedin: '',
          twitter: '',
          github: '',
          portfolio: ''
        },
        proofOfWork: user.proofOfWork || []
      });
      setLoading(false);
    }
  }, [user, authLoading, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith('social.')) {
      const socialField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialField]: value
        }
      }));
      return;
    }

    if (name.startsWith('preferences.')) {
      const preferencesField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [preferencesField]: type === 'checkbox' ? checked : value
        }
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSkillChange = (e) => {
    const skills = e.target.value.split(',').map((skill) => skill.trim());
    setFormData((prev) => ({
      ...prev,
      skills,
    }));
  };

  const handleExperienceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewExperience((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleEducationChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewEducation((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const addExperience = () => {
    if (!newExperience.title || !newExperience.company || !newExperience.startDate) {
      setError('Please fill in all required fields for experience');
      return;
    }

    const experience = {
      id: Date.now().toString(),
      title: newExperience.title,
      company: newExperience.company,
      description: newExperience.description,
      startDate: new Date(newExperience.startDate).getTime(),
      endDate: newExperience.isCurrent ? null : new Date(newExperience.endDate).getTime(),
      isCurrent: newExperience.isCurrent,
    };

    setFormData((prev) => ({
      ...prev,
      experience: [...prev.experience, experience],
    }));

    setNewExperience({
      title: '',
      company: '',
      description: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
    });
    setShowExperienceForm(false);
  };

  const addEducation = () => {
    if (!newEducation.institution || !newEducation.degree || !newEducation.startDate) {
      setError('Please fill in all required fields for education');
      return;
    }

    const education = {
      id: Date.now().toString(),
      institution: newEducation.institution,
      degree: newEducation.degree,
      field: newEducation.field,
      startDate: new Date(newEducation.startDate).getTime(),
      endDate: newEducation.isCurrent ? null : new Date(newEducation.endDate).getTime(),
      isCurrent: newEducation.isCurrent,
    };

    setFormData((prev) => ({
      ...prev,
      education: [...prev.education, education],
    }));

    setNewEducation({
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
    });
    setShowEducationForm(false);
  };

  const removeExperience = (id) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.filter((exp) => exp.id !== id),
    }));
  };

  const removeEducation = (id) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
  };

  const handleAddWork = () => {
    if (!newWork.title || !newWork.description) {
      toast.error('Please fill in the required fields');
      return;
    }

    const newProofOfWork = {
      id: `temp-${Date.now()}`, // Temporary ID for new items
      title: newWork.title,
      description: newWork.description,
      url: newWork.url || null,
      date: Date.now(),
      powType: newWork.type
    };

    setFormData(prev => ({
      ...prev,
      proofOfWork: [...prev.proofOfWork, newProofOfWork]
    }));

    setNewWork({
      title: '',
      description: '',
      url: '',
      type: 'project'
    });
  };

  const handleRemoveWork = (workId) => {
    setFormData(prev => ({
      ...prev,
      proofOfWork: prev.proofOfWork.filter(work => work.id !== workId)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    try {
      // Update basic user info
      const updatedUser = await updateUser({
        username: formData.username,
        email: formData.email,
        bio: Array.isArray(formData.bio) ? formData.bio[0] : formData.bio, // Convert array to string if needed
        skills: formData.skills,
        role: formData.role,
        preferences: formData.preferences,
        socialLinks: formData.socialLinks,
        proofOfWork: formData.proofOfWork
      });

      // Refresh user data
      await refreshUser();
      
      setEditing(false);
      setSaving(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      setSaving(false);
      setSaveError(error.message || 'Failed to update profile. Please try again.');
      toast.error(error.message || 'Failed to update profile. Please try again.');
      
      // If we get an authentication error, redirect to login
      if (error.message && (
          error.message.includes('authentication') || 
          error.message.includes('unauthorized') || 
          error.message.includes('not authenticated')
        )) {
        toast.error('Your session has expired. Please log in again.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Present';
    // Convert BigInt to number if needed
    const timestampNum = typeof timestamp === 'bigint' ? Number(timestamp) : timestamp;
    const date = new Date(timestampNum);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (authError || error) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {authError || error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Edit Profile
              </button>
            )}
          </div>
          {user?.verified && (
            <div className="mt-2 flex items-center text-green-600">
              <svg className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Verified Account</span>
            </div>
          )}
        </div>

        {editing ? (
          <form onSubmit={handleSubmit} className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                  Bio
                </label>
                <textarea
                  name="bio"
                  id="bio"
                  rows={4}
                  value={formData.bio}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  name="role"
                  id="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="jobseeker">Job Seeker</option>
                  <option value="employer">Employer</option>
                </select>
              </div>

              <div>
                <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
                  Skills (comma-separated)
                </label>
                <input
                  type="text"
                  name="skills"
                  id="skills"
                  value={formData.skills.join(', ')}
                  onChange={handleSkillChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              {/* Experience Section */}
              <div>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Experience</h3>
                  <button
                    type="button"
                    onClick={() => setShowExperienceForm(!showExperienceForm)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    {showExperienceForm ? 'Cancel' : 'Add Experience'}
                  </button>
                </div>
                
                {formData.experience.length > 0 && (
                  <div className="mt-4 space-y-4">
                    {formData.experience.map((exp) => (
                      <div key={exp.id} className="border rounded-md p-4 relative">
                        <button
                          type="button"
                          onClick={() => removeExperience(exp.id)}
                          className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        >
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <h4 className="font-medium">{exp.title}</h4>
                        <p className="text-gray-600">{exp.company}</p>
                        <p className="text-sm text-gray-500">
                          {formatDate(exp.startDate)} - {exp.isCurrent ? 'Present' : formatDate(exp.endDate)}
                        </p>
                        <p className="mt-2 text-gray-700">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                )}
                
                {showExperienceForm && (
                  <div className="mt-4 border rounded-md p-4 space-y-4">
                    <div>
                      <label htmlFor="exp-title" className="block text-sm font-medium text-gray-700">
                        Title
                      </label>
                      <input
                        type="text"
                        id="exp-title"
                        name="title"
                        value={newExperience.title}
                        onChange={handleExperienceChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="exp-company" className="block text-sm font-medium text-gray-700">
                        Company
                      </label>
                      <input
                        type="text"
                        id="exp-company"
                        name="company"
                        value={newExperience.company}
                        onChange={handleExperienceChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="exp-description" className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        id="exp-description"
                        name="description"
                        value={newExperience.description}
                        onChange={handleExperienceChange}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="exp-start-date" className="block text-sm font-medium text-gray-700">
                          Start Date
                        </label>
                        <input
                          type="date"
                          id="exp-start-date"
                          name="startDate"
                          value={newExperience.startDate}
                          onChange={handleExperienceChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="exp-end-date" className="block text-sm font-medium text-gray-700">
                          End Date
                        </label>
                        <input
                          type="date"
                          id="exp-end-date"
                          name="endDate"
                          value={newExperience.endDate}
                          onChange={handleExperienceChange}
                          disabled={newExperience.isCurrent}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="exp-current"
                        name="isCurrent"
                        checked={newExperience.isCurrent}
                        onChange={handleExperienceChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="exp-current" className="ml-2 block text-sm text-gray-700">
                        I currently work here
                      </label>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={addExperience}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                      >
                        Add Experience
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Education Section */}
              <div>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Education</h3>
                  <button
                    type="button"
                    onClick={() => setShowEducationForm(!showEducationForm)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    {showEducationForm ? 'Cancel' : 'Add Education'}
                  </button>
                </div>
                
                {formData.education.length > 0 && (
                  <div className="mt-4 space-y-4">
                    {formData.education.map((edu) => (
                      <div key={edu.id} className="border rounded-md p-4 relative">
                        <button
                          type="button"
                          onClick={() => removeEducation(edu.id)}
                          className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        >
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <h4 className="font-medium">{edu.institution}</h4>
                        <p className="text-gray-600">{edu.degree} in {edu.field}</p>
                        <p className="text-sm text-gray-500">
                          {formatDate(edu.startDate)} - {edu.isCurrent ? 'Present' : formatDate(edu.endDate)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                
                {showEducationForm && (
                  <div className="mt-4 border rounded-md p-4 space-y-4">
                    <div>
                      <label htmlFor="edu-institution" className="block text-sm font-medium text-gray-700">
                        Institution
                      </label>
                      <input
                        type="text"
                        id="edu-institution"
                        name="institution"
                        value={newEducation.institution}
                        onChange={handleEducationChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="edu-degree" className="block text-sm font-medium text-gray-700">
                          Degree
                        </label>
                        <input
                          type="text"
                          id="edu-degree"
                          name="degree"
                          value={newEducation.degree}
                          onChange={handleEducationChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="edu-field" className="block text-sm font-medium text-gray-700">
                          Field of Study
                        </label>
                        <input
                          type="text"
                          id="edu-field"
                          name="field"
                          value={newEducation.field}
                          onChange={handleEducationChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="edu-start-date" className="block text-sm font-medium text-gray-700">
                          Start Date
                        </label>
                        <input
                          type="date"
                          id="edu-start-date"
                          name="startDate"
                          value={newEducation.startDate}
                          onChange={handleEducationChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="edu-end-date" className="block text-sm font-medium text-gray-700">
                          End Date
                        </label>
                        <input
                          type="date"
                          id="edu-end-date"
                          name="endDate"
                          value={newEducation.endDate}
                          onChange={handleEducationChange}
                          disabled={newEducation.isCurrent}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="edu-current"
                        name="isCurrent"
                        checked={newEducation.isCurrent}
                        onChange={handleEducationChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="edu-current" className="ml-2 block text-sm text-gray-700">
                        I am currently studying here
                      </label>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={addEducation}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                      >
                        Add Education
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900">Job Preferences</h3>
                <div className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="preferredLocations" className="block text-sm font-medium text-gray-700">
                      Preferred Locations (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="preferredLocations"
                      id="preferredLocations"
                      value={formData.preferences.preferredLocations.join(', ')}
                      onChange={(e) => {
                        const locations = e.target.value.split(',').map((loc) => loc.trim());
                        setFormData((prev) => ({
                          ...prev,
                          preferences: {
                            ...prev.preferences,
                            preferredLocations: locations,
                          },
                        }));
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="preferredJobTypes" className="block text-sm font-medium text-gray-700">
                      Preferred Job Types (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="preferredJobTypes"
                      id="preferredJobTypes"
                      value={formData.preferences.preferredJobTypes.join(', ')}
                      onChange={(e) => {
                        const jobTypes = e.target.value.split(',').map((type) => type.trim());
                        setFormData((prev) => ({
                          ...prev,
                          preferences: {
                            ...prev.preferences,
                            preferredJobTypes: jobTypes,
                          },
                        }));
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="preferredCategories" className="block text-sm font-medium text-gray-700">
                      Preferred Categories (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="preferredCategories"
                      id="preferredCategories"
                      value={formData.preferences.preferredCategories.join(', ')}
                      onChange={(e) => {
                        const categories = e.target.value.split(',').map((cat) => cat.trim());
                        setFormData((prev) => ({
                          ...prev,
                          preferences: {
                            ...prev.preferences,
                            preferredCategories: categories,
                          },
                        }));
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="salaryExpectation" className="block text-sm font-medium text-gray-700">
                      Salary Expectation (ICP)
                    </label>
                    <input
                      type="number"
                      name="salaryExpectation"
                      id="salaryExpectation"
                      value={formData.preferences.salaryExpectation}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="remotePreference" className="block text-sm font-medium text-gray-700">
                      Remote Work Preference
                    </label>
                    <input
                      type="checkbox"
                      name="remotePreference"
                      id="remotePreference"
                      checked={formData.preferences.remotePreference}
                      onChange={handleChange}
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700">
                      Experience Level
                    </label>
                    <select
                      name="experienceLevel"
                      id="experienceLevel"
                      value={formData.preferences.experienceLevel}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="">Select experience level</option>
                      <option value="entry">Entry Level</option>
                      <option value="mid">Mid Level</option>
                      <option value="senior">Senior Level</option>
                      <option value="lead">Lead</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900">Social Links</h3>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center space-x-2">
                    <FaLinkedin className="text-blue-600" />
                    <input
                      type="text"
                      name="social.linkedin"
                      value={formData.socialLinks.linkedin}
                      onChange={handleChange}
                      placeholder="LinkedIn URL"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaTwitter className="text-blue-400" />
                    <input
                      type="text"
                      name="social.twitter"
                      value={formData.socialLinks.twitter}
                      onChange={handleChange}
                      placeholder="Twitter URL"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaGithub className="text-gray-800" />
                    <input
                      type="text"
                      name="social.github"
                      value={formData.socialLinks.github}
                      onChange={handleChange}
                      placeholder="GitHub URL"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaGlobe className="text-gray-600" />
                    <input
                      type="text"
                      name="social.portfolio"
                      value={formData.socialLinks.portfolio}
                      onChange={handleChange}
                      placeholder="Portfolio URL"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900">Proof of Work</h3>
                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <input
                      type="text"
                      value={newWork.title}
                      onChange={(e) => setNewWork(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Title"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <textarea
                      value={newWork.description}
                      onChange={(e) => setNewWork(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Description"
                      rows="3"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <input
                      type="text"
                      value={newWork.url}
                      onChange={(e) => setNewWork(prev => ({ ...prev, url: e.target.value }))}
                      placeholder="URL (optional)"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <select
                      value={newWork.type}
                      onChange={(e) => setNewWork(prev => ({ ...prev, type: e.target.value }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="blog">Blog Post</option>
                      <option value="project">Project</option>
                      <option value="article">Article</option>
                      <option value="other">Other</option>
                    </select>
                    <button
                      type="button"
                      onClick={handleAddWork}
                      className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Add Proof of Work
                    </button>
                  </div>
                  <div className="space-y-4">
                    {formData.proofOfWork.map((work) => (
                      <div key={work.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold">{work.title}</h3>
                            <p className="text-gray-600">{work.description}</p>
                            {work.url && (
                              <a
                                href={work.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 hover:text-indigo-800"
                              >
                                View Link
                              </a>
                            )}
                            <p className="text-sm text-gray-500">
                              {new Date(work.date).toLocaleDateString()} - {work.type}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveWork(work.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <FaTrash className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Username</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formData.username}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formData.email}</dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Bio</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formData.bio || 'No bio provided'}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Role</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 capitalize">{formData.role}</dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Skills</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {formData.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map((skill, index) => (
                        <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    'No skills listed'
                  )}
                </dd>
              </div>
              
              {/* Experience Display */}
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Experience</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {formData.experience.length > 0 ? (
                    <div className="space-y-4">
                      {formData.experience.map((exp) => (
                        <div key={exp.id} className="border-l-4 border-indigo-500 pl-4">
                          <h4 className="font-medium">{exp.title}</h4>
                          <p className="text-gray-600">{exp.company}</p>
                          <p className="text-sm text-gray-500">
                            {formatDate(exp.startDate)} - {exp.isCurrent ? 'Present' : formatDate(exp.endDate)}
                          </p>
                          <p className="mt-2 text-gray-700">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    'No experience listed'
                  )}
                </dd>
              </div>
              
              {/* Education Display */}
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Education</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {formData.education.length > 0 ? (
                    <div className="space-y-4">
                      {formData.education.map((edu) => (
                        <div key={edu.id} className="border-l-4 border-indigo-500 pl-4">
                          <h4 className="font-medium">{edu.institution}</h4>
                          <p className="text-gray-600">{edu.degree} in {edu.field}</p>
                          <p className="text-sm text-gray-500">
                            {formatDate(edu.startDate)} - {edu.isCurrent ? 'Present' : formatDate(edu.endDate)}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    'No education listed'
                  )}
                </dd>
              </div>
              
              {/* Job Preferences Display */}
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Job Preferences</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Preferred Locations:</span>{' '}
                      {formData.preferences.preferredLocations.length > 0 ? (
                        <span>{formData.preferences.preferredLocations.join(', ')}</span>
                      ) : (
                        <span className="text-gray-500">Not specified</span>
                      )}
                    </div>
                    <div>
                      <span className="font-medium">Preferred Job Types:</span>{' '}
                      {formData.preferences.preferredJobTypes.length > 0 ? (
                        <span>{formData.preferences.preferredJobTypes.join(', ')}</span>
                      ) : (
                        <span className="text-gray-500">Not specified</span>
                      )}
                    </div>
                    <div>
                      <span className="font-medium">Preferred Categories:</span>{' '}
                      {formData.preferences.preferredCategories.length > 0 ? (
                        <span>{formData.preferences.preferredCategories.join(', ')}</span>
                      ) : (
                        <span className="text-gray-500">Not specified</span>
                      )}
                    </div>
                    <div>
                      <span className="font-medium">Salary Expectation:</span>{' '}
                      {formData.preferences.salaryExpectation > 0 ? (
                        <span>{formData.preferences.salaryExpectation} ICP</span>
                      ) : (
                        <span className="text-gray-500">Not specified</span>
                      )}
                    </div>
                    <div>
                      <span className="font-medium">Remote Work:</span>{' '}
                      {formData.preferences.remotePreference ? 'Yes' : 'No'}
                    </div>
                    <div>
                      <span className="font-medium">Experience Level:</span>{' '}
                      {formData.preferences.experienceLevel ? (
                        <span className="capitalize">{formData.preferences.experienceLevel}</span>
                      ) : (
                        <span className="text-gray-500">Not specified</span>
                      )}
                    </div>
                  </div>
                </dd>
              </div>

              {/* Social Links */}
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Social Links</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <div className="space-y-2">
                    {formData.socialLinks.linkedin && (
                      <div className="flex items-center space-x-2">
                        <FaLinkedin className="text-blue-600" />
                        <a href={formData.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                          LinkedIn Profile
                        </a>
                      </div>
                    )}
                    {formData.socialLinks.twitter && (
                      <div className="flex items-center space-x-2">
                        <FaTwitter className="text-blue-400" />
                        <a href={formData.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                          Twitter Profile
                        </a>
                      </div>
                    )}
                    {formData.socialLinks.github && (
                      <div className="flex items-center space-x-2">
                        <FaGithub className="text-gray-800" />
                        <a href={formData.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                          GitHub Profile
                        </a>
                      </div>
                    )}
                    {formData.socialLinks.portfolio && (
                      <div className="flex items-center space-x-2">
                        <FaGlobe className="text-gray-600" />
                        <a href={formData.socialLinks.portfolio} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                          Portfolio Website
                        </a>
                      </div>
                    )}
                    {!formData.socialLinks.linkedin && !formData.socialLinks.twitter && !formData.socialLinks.github && !formData.socialLinks.portfolio && (
                      <p className="text-gray-500">No social links provided</p>
                    )}
                  </div>
                </dd>
              </div>

              {/* Proof of Work */}
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Proof of Work</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {formData.proofOfWork.length > 0 ? (
                    <div className="space-y-4">
                      {formData.proofOfWork.map((work) => (
                        <div key={work.id} className="border rounded-lg p-4">
                          <h3 className="text-lg font-semibold">{work.title}</h3>
                          <p className="text-gray-600">{work.description}</p>
                          {work.url && (
                            <a
                              href={work.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:text-indigo-800"
                            >
                              View Link
                            </a>
                          )}
                          <p className="text-sm text-gray-500 mt-2">
                            {new Date(work.date).toLocaleDateString()} - {work.type}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No proof of work added</p>
                  )}
                </dd>
              </div>
            </dl>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile; 