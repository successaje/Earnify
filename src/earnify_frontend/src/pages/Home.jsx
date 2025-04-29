import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getAllJobs, getAllBounties } from '../utils/ic';
import RecentEarners from '../components/RecentEarners';
import poweredByICPLogo from '../assets/powered-by-icp.png';

function Home() {
  const { user } = useAuth();
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentBounties, setRecentBounties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [particles, setParticles] = useState([]);

  // Generate random particles
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 20; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          duration: Math.random() * 20 + 10,
          delay: Math.random() * 5,
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  // Placeholder data for verified events
  const verifiedEvents = [
    { id: 1, title: 'ICP Global Summit 2023', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', date: 'October 15-17, 2023' },
    { id: 2, title: 'Earnify Launch Event', image: 'https://images.unsplash.com/photo-1511795409834-432f7b1728d2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', date: 'September 5, 2023' },
    { id: 3, title: 'Web3 Developer Conference', image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', date: 'August 20, 2023' },
  ];

  // Placeholder data for grants
  const grants = [
    { id: 1, title: 'Ecosystem Development Grant', amount: '50,000 ICP', deadline: 'December 31, 2023', applicants: 24 },
    { id: 2, title: 'Innovation in DeFi', amount: '30,000 ICP', deadline: 'November 15, 2023', applicants: 18 },
    { id: 3, title: 'Community Building Initiative', amount: '20,000 ICP', deadline: 'October 30, 2023', applicants: 12 },
  ];

  // Platform stats
  const platformStats = [
    { id: 1, label: 'Active Users', value: '12,500+' },
    { id: 2, label: 'Jobs Posted', value: '3,200+' },
    { id: 3, label: 'Bounties Completed', value: '1,800+' },
    { id: 4, label: 'Total Earnings', value: '450,000+ ICP' },
  ];

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

  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % verifiedEvents.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    // Convert BigInt to number if needed
    const timestampNum = typeof timestamp === 'bigint' ? Number(timestamp) : timestamp;
    const date = new Date(timestampNum);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-indigo-700 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
            alt="Background"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 via-indigo-700 to-indigo-900 animate-gradient-x-slow opacity-80"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
          
          {/* Floating particles */}
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute rounded-full bg-white opacity-30"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                animation: `float ${particle.duration}s ease-in-out ${particle.delay}s infinite alternate`,
              }}
            ></div>
          ))}
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight mb-4 ${
              user 
                ? 'animate-gradient bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-white to-indigo-200 bg-[length:200%_auto] animate-gradient-x'
                : 'text-white'
            }`}>
              {user ? `Welcome back, ${user.username || 'User'}!` : 'Welcome to Earnify'}
            </h1>
            <p className="text-xl md:text-2xl text-indigo-100 max-w-3xl mx-auto mb-8">
              {user 
                ? "Your next opportunity awaits. Browse jobs, complete bounties, and earn rewards."
                : "Find your next opportunity or hire talented professionals on the Internet Computer"}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/jobs"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50"
              >
                Browse Jobs
              </Link>
              <Link
                to="/bounties"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600"
              >
                View Bounties
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Stats */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {platformStats.map((stat) => (
              <div key={stat.id} className="bg-indigo-50 rounded-lg p-6 text-center">
                <p className="text-3xl font-bold text-indigo-700 mb-1">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Verified Events Carousel */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Verified Events</h2>
                <div className="relative h-64 overflow-hidden rounded-lg">
                  {verifiedEvents.map((event, index) => (
                    <div
                      key={event.id}
                      className={`absolute inset-0 transition-opacity duration-500 ${
                        index === currentSlide ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                        <h3 className="text-white font-bold">{event.title}</h3>
                        <p className="text-indigo-200 text-sm">{event.date}</p>
                      </div>
                    </div>
                  ))}
                  <div className="absolute bottom-4 right-4 flex space-x-2">
                    {verifiedEvents.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2 h-2 rounded-full ${
                          index === currentSlide ? 'bg-white' : 'bg-white/50'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Grants Section */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Grants</h2>
              <div className="space-y-4">
                {grants.map((grant) => (
                  <div key={grant.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{grant.title}</h3>
                        <p className="text-sm text-gray-500">Deadline: {grant.deadline}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-indigo-600">{grant.amount}</p>
                        <p className="text-xs text-gray-500">{grant.applicants} applicants</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Link
                        to={`/grants/${grant.id}`}
                        className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                ))}
                <div className="text-center mt-4">
                  <Link
                    to="/grants"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                  >
                    View All Grants
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <RecentEarners />
          </div>
        </div>
      </div>

      {/* Features Section */}
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

      {/* Footer with ICP branding */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-xl font-bold mb-4">Earnify</h3>
              <p className="text-gray-400 mb-4">
                Find opportunities, showcase your skills, and earn rewards on the Internet Computer.
              </p>
              <div className="flex items-center">
                {/* <span className="text-gray-400 mr-2">Powered by</span> */}
                <img 
                  src={poweredByICPLogo} 
                  alt="Powered by ICP" 
                  className="h-6"
                />
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/jobs" className="text-gray-400 hover:text-white">Jobs</Link></li>
                <li><Link to="/bounties" className="text-gray-400 hover:text-white">Bounties</Link></li>
                <li><Link to="/grants" className="text-gray-400 hover:text-white">Grants</Link></li>
                <li><Link to="/leaderboard" className="text-gray-400 hover:text-white">Leaderboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><Link to="/help" className="text-gray-400 hover:text-white">Help Center</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact Us</Link></li>
                <li><Link to="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Earnify. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home; 