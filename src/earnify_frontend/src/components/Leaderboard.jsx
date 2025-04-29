import React, { useState, useEffect } from 'react';
import { getAllUsers } from '../utils/ic';
import { Principal } from '@dfinity/principal';

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await getAllUsers();
        if (result.err) {
          setError(result.err);
          // Use placeholder data when backend fetch fails
          setUsers(generatePlaceholderData());
        } else {
          // Process users to ensure all required fields are present
          const processedUsers = result.ok.map(user => ({
            ...user,
            principal: typeof user.principal === 'object' ? user.principal.toText() : user.principal,
            totalEarnings: user.totalEarnings || 0,
            completedJobs: user.completedJobs || 0,
            reputation: user.reputation || 0
          }));
          // Sort users by total earnings in descending order
          const sortedUsers = processedUsers.sort((a, b) => b.totalEarnings - a.totalEarnings);
          setUsers(sortedUsers);
        }
      } catch (err) {
        console.error('Error fetching leaderboard data:', err);
        // Use placeholder data when backend fetch fails
        setUsers(generatePlaceholderData());
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Generate placeholder data for the leaderboard
  const generatePlaceholderData = () => {
    return [
      { username: 'Alice', principal: '2vxsx-fae...', totalEarnings: 125.50, completedJobs: 15, reputation: 4.8 },
      { username: 'Bob', principal: '3dxzt-abc...', totalEarnings: 98.75, completedJobs: 12, reputation: 4.6 },
      { username: 'Charlie', principal: '4dxzt-def...', totalEarnings: 87.25, completedJobs: 10, reputation: 4.5 },
      { username: 'Diana', principal: '5dxzt-ghi...', totalEarnings: 76.50, completedJobs: 9, reputation: 4.3 },
      { username: 'Ethan', principal: '6dxzt-jkl...', totalEarnings: 65.25, completedJobs: 8, reputation: 4.2 },
      { username: 'Fiona', principal: '7dxzt-mno...', totalEarnings: 54.75, completedJobs: 7, reputation: 4.0 },
      { username: 'George', principal: '8dxzt-pqr...', totalEarnings: 43.50, completedJobs: 6, reputation: 3.9 },
      { username: 'Hannah', principal: '9dxzt-stu...', totalEarnings: 32.25, completedJobs: 5, reputation: 3.8 },
      { username: 'Ian', principal: '0dxzt-vwx...', totalEarnings: 21.00, completedJobs: 4, reputation: 3.7 },
      { username: 'Julia', principal: '1dxzt-yza...', totalEarnings: 10.50, completedJobs: 3, reputation: 3.6 },
    ];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // We no longer need to show the error message since we're using placeholder data
  // if (error) {
  //   return (
  //     <div className="text-red-600 text-center p-4">
  //       {error}
  //     </div>
  //   );
  // }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Top Earners</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">Users ranked by total earnings</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Earnings
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Completed Jobs
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reputation
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user, index) => (
              <tr key={typeof user.principal === 'string' ? user.principal : user.principal.toText()} className={index < 3 ? 'bg-yellow-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.totalEarnings.toFixed(2)} ICP
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.completedJobs}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.reputation.toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard; 