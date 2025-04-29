import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJob, applyForJob } from '../utils/ic';
import { Principal } from '@dfinity/principal';

function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const result = await getJob(id);
        if (result.err) {
          setError(result.err);
          setJob(null);
        } else {
          // Convert Principal objects to strings
          const processedJob = {
            ...result.ok,
            postedBy: result.ok.postedBy.toText(),
            applications: result.ok.applications.map(app => app.toText())
          };
          setJob(processedJob);
        }
      } catch (err) {
        setError('Failed to load job details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleApply = async () => {
    setApplying(true);
    setError(null);

    try {
      await applyForJob(id);
      navigate('/jobs');
    } catch (err) {
      setError('Failed to apply for job. Please try again.');
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-gray-600">Job not found</div>
      </div>
    );
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    // Convert BigInt to number if needed
    const timestampNum = typeof timestamp === 'bigint' ? Number(timestamp) : timestamp;
    const date = new Date(timestampNum);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {job.company}
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="mt-1 text-sm text-gray-900">{job.description}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Salary</dt>
              <dd className="mt-1 text-sm text-gray-900">{job.salary} ICP</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Location</dt>
              <dd className="mt-1 text-sm text-gray-900">{job.location}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Job Type</dt>
              <dd className="mt-1 text-sm text-gray-900">{job.jobType}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Experience Level</dt>
              <dd className="mt-1 text-sm text-gray-900">{job.experienceLevel}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Remote</dt>
              <dd className="mt-1 text-sm text-gray-900">{job.remote ? 'Yes' : 'No'}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Requirements</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <ul className="list-disc list-inside">
                  {job.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Benefits</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <ul className="list-disc list-inside">
                  {job.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Tags</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </dd>
            </div>
          </dl>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => navigate('/jobs')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Back to Jobs
            </button>
            {job.status === 'open' && (
              <button
                onClick={handleApply}
                disabled={applying}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {applying ? 'Applying...' : 'Apply for Job'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetail; 