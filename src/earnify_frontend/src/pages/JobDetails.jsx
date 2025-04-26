import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    // TODO: Fetch job details from the backend
    // This is a placeholder for now
    setLoading(false);
  }, [id]);

  const handleApply = async () => {
    if (!user) {
      // Redirect to login if not authenticated
      return;
    }
    
    setApplying(true);
    try {
      // TODO: Implement job application logic
      console.log('Applying for job:', id);
    } catch (err) {
      console.error('Error applying for job:', err);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600">Error loading job details</h2>
        <p className="mt-2 text-gray-600">{error}</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-600">Job not found</h2>
        <p className="mt-2 text-gray-500">The job you're looking for doesn't exist or has been removed.</p>
        <Link to="/jobs" className="mt-4 inline-block text-indigo-600 hover:text-indigo-500">
          Browse other jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                <p className="mt-1 text-sm text-gray-500">{job.company}</p>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <span className="mr-4">{job.location}</span>
                  <span>{job.jobType}</span>
                  {job.remote && <span className="ml-4">Remote</span>}
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  {job.category}
                </span>
                <span className="mt-2 text-lg font-semibold text-gray-900">
                  ${job.salary.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Job Description</h3>
                <p className="mt-2 text-gray-600 whitespace-pre-line">{job.description}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Requirements</h3>
                <ul className="mt-2 list-disc list-inside text-gray-600">
                  {job.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
                <h3 className="mt-6 text-lg font-medium text-gray-900">Benefits</h3>
                <ul className="mt-2 list-disc list-inside text-gray-600">
                  {job.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div className="flex justify-end">
              {user ? (
                <button
                  onClick={handleApply}
                  disabled={applying}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {applying ? 'Applying...' : 'Apply Now'}
                </button>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Login to Apply
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails; 