import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getAllJobs, getAllBounties } from '../utils/ic';
import RecentEarners from '../components/RecentEarners';

function Home() {
  const { user } = useAuth();
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentBounties, setRecentBounties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobs, bounties] = await Promise.all([
          getAllJobs(),
          getAllBounties()
        ]);
        
        // Sort by most recent (assuming the most recent are at the end of the array)
        const sortedJobs = [...jobs].sort((a, b) => b.createdAt - a.createdAt).slice(0, 3);
        const sortedBounties = [...bounties].sort((a, b) => b.createdAt - a.createdAt).slice(0, 3);
        
        setRecentJobs(sortedJobs);
        setRecentBounties(sortedBounties);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    // Convert BigInt to number if needed
    const timestampNum = typeof timestamp === 'bigint' ? Number(timestamp) : timestamp;
    const date = new Date(timestampNum);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to Earnify
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Find your next opportunity or hire talented professionals
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                to="/jobs"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Browse Jobs
              </Link>
              <Link
                to="/bounties"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                View Bounties
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Featured Opportunities
            </h2>
            {/* Add featured jobs and bounties here */}
          </div>
        </div>

        <div className="lg:col-span-1">
          <RecentEarners />
        </div>
      </div>

      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to succeed
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Our platform provides all the tools you need to find opportunities, showcase your skills, and earn rewards.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Job Listings</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Browse through a wide range of job opportunities from top companies.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Bounties</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Complete tasks and earn rewards in ICP tokens.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Community</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Connect with other professionals and share your experiences.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Secure Payments</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Get paid securely in ICP tokens for your work.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Latest Opportunities
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Check out the most recent jobs and bounties posted on our platform.
            </p>
          </div>

          {loading ? (
            <div className="mt-10 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <div className="mt-10">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Jobs</h3>
                  {recentJobs.length > 0 ? (
                    <div className="space-y-4">
                      {recentJobs.map((job) => (
                        <div key={job.id} className="bg-white shadow overflow-hidden sm:rounded-lg">
                          <div className="px-4 py-5 sm:px-6">
                            <h4 className="text-lg font-medium text-gray-900">{job.title}</h4>
                            <p className="mt-1 text-sm text-gray-500">{job.company}</p>
                            <p className="mt-1 text-sm text-gray-500">Posted: {formatDate(job.createdAt)}</p>
                          </div>
                          <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
                            <div className="flex justify-between">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {job.jobType}
                              </span>
                              <Link
                                to={`/jobs/${job.id}`}
                                className="text-indigo-600 hover:text-indigo-900 font-medium"
                              >
                                View Details
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="text-center mt-4">
                        <Link
                          to="/jobs"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                        >
                          View All Jobs
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">No jobs available at the moment.</p>
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Bounties</h3>
                  {recentBounties.length > 0 ? (
                    <div className="space-y-4">
                      {recentBounties.map((bounty) => (
                        <div key={bounty.id} className="bg-white shadow overflow-hidden sm:rounded-lg">
                          <div className="px-4 py-5 sm:px-6">
                            <h4 className="text-lg font-medium text-gray-900">{bounty.title}</h4>
                            <p className="mt-1 text-sm text-gray-500">Reward: {bounty.reward} ICP</p>
                            <p className="mt-1 text-sm text-gray-500">Posted: {formatDate(bounty.createdAt)}</p>
                          </div>
                          <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
                            <div className="flex justify-between">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {bounty.status}
                              </span>
                              <Link
                                to={`/bounties/${bounty.id}`}
                                className="text-indigo-600 hover:text-indigo-900 font-medium"
                              >
                                View Details
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="text-center mt-4">
                        <Link
                          to="/bounties"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                        >
                          View All Bounties
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">No bounties available at the moment.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              What Our Users Say
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Hear from people who have found opportunities and earned rewards on our platform.
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-600 font-bold">JD</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">John Doe</h4>
                    <p className="text-sm text-gray-500">Software Developer</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "I found my dream job through Earnify. The platform made it easy to showcase my skills and connect with employers."
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-600 font-bold">AS</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">Alice Smith</h4>
                    <p className="text-sm text-gray-500">Freelance Designer</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "The bounties on Earnify have been a great way for me to earn extra income while working on interesting projects."
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-600 font-bold">RJ</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">Robert Johnson</h4>
                    <p className="text-sm text-gray-500">Employer</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "As an employer, Earnify has helped me find talented professionals for my projects. The platform is efficient and user-friendly."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-indigo-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-indigo-200">Join our platform today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              {user ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
                >
                  Sign In Now
                </Link>
              )}
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                to="/how-it-works"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home; 