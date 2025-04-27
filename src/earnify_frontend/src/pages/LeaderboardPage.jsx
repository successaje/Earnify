import React from 'react';
import Leaderboard from '../components/Leaderboard';

const LeaderboardPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Leaderboard</h1>
        <p className="mt-2 text-lg text-gray-600">
          See who's earning the most on Earnify
        </p>
      </div>
      
      <Leaderboard />
    </div>
  );
};

export default LeaderboardPage; 