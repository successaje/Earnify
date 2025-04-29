import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const RecentEarners = () => {
  const [earners, setEarners] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Generate placeholder data with diverse names from different cultures
    const generatePlaceholderData = () => {
      return [
        { id: 1, name: 'Aisha', location: 'Nigeria', earnings: '42.50', timeAgo: '2 minutes ago' },
        { id: 2, name: 'Chen Wei', location: 'China', earnings: '38.75', timeAgo: '5 minutes ago' },
        { id: 3, name: 'Priya', location: 'India', earnings: '35.25', timeAgo: '8 minutes ago' },
        { id: 4, name: 'Miguel', location: 'Mexico', earnings: '31.50', timeAgo: '12 minutes ago' },
        { id: 5, name: 'Sofia', location: 'Italy', earnings: '28.75', timeAgo: '15 minutes ago' },
        { id: 6, name: 'Yuki', location: 'Japan', earnings: '25.25', timeAgo: '20 minutes ago' },
        { id: 7, name: 'Ahmed', location: 'Egypt', earnings: '22.50', timeAgo: '25 minutes ago' },
        { id: 8, name: 'Emma', location: 'Sweden', earnings: '19.75', timeAgo: '30 minutes ago' },
        { id: 9, name: 'Lucas', location: 'Brazil', earnings: '17.25', timeAgo: '35 minutes ago' },
        { id: 10, name: 'Zara', location: 'Pakistan', earnings: '15.50', timeAgo: '40 minutes ago' },
        { id: 11, name: 'Hassan', location: 'Morocco', earnings: '13.75', timeAgo: '45 minutes ago' },
        { id: 12, name: 'Nina', location: 'Russia', earnings: '12.25', timeAgo: '50 minutes ago' },
        { id: 13, name: 'Jin', location: 'South Korea', earnings: '10.50', timeAgo: '55 minutes ago' },
        { id: 14, name: 'Fatima', location: 'Saudi Arabia', earnings: '9.75', timeAgo: '1 hour ago' },
        { id: 15, name: 'Liam', location: 'Ireland', earnings: '8.25', timeAgo: '1 hour ago' },
        { id: 16, name: 'Amara', location: 'Ghana', earnings: '7.50', timeAgo: '1 hour ago' },
        { id: 17, name: 'Diego', location: 'Spain', earnings: '6.75', timeAgo: '1 hour ago' },
        { id: 18, name: 'Mei', location: 'Vietnam', earnings: '5.25', timeAgo: '1 hour ago' },
        { id: 19, name: 'Omar', location: 'Jordan', earnings: '4.50', timeAgo: '1 hour ago' },
        { id: 20, name: 'Freya', location: 'Norway', earnings: '3.75', timeAgo: '1 hour ago' },
      ];
    };

    // Set placeholder data
    setEarners(generatePlaceholderData());
    setLoading(false);
  }, []);

  useEffect(() => {
    if (loading || isPaused) return;

    const scrollInterval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        
        // If we've reached the bottom, scroll back to the top
        if (scrollTop + clientHeight >= scrollHeight) {
          scrollRef.current.scrollTop = 0;
        } else {
          // Scroll down by 1 pixel
          scrollRef.current.scrollTop += 1;
        }
      }
    }, 50); // Adjust speed by changing this value (lower = faster)

    return () => clearInterval(scrollInterval);
  }, [loading, isPaused]);

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Recent Earners</h2>
        <Link 
          to="/leaderboard" 
          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
        >
          View Leaderboard
        </Link>
      </div>
      
      <div 
        ref={scrollRef}
        className="overflow-hidden h-64"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="space-y-2">
          {earners.map((earner) => (
            <div 
              key={earner.id} 
              className="flex justify-between items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                  {earner.name.charAt(0)}
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-800">{earner.name}</p>
                  <p className="text-xs text-gray-500">{earner.location}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-green-600">{earner.earnings} ICP</p>
                <p className="text-xs text-gray-500">{earner.timeAgo}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
    </div>
  );
};

export default RecentEarners; 