import { useState, useEffect } from 'react';
import { getCurrentPrincipal } from '../utils/ic';

const WalletSidebar = ({ isOpen, onClose, user }) => {
  const [principal, setPrincipal] = useState('');
  const [balance, setBalance] = useState('0.00');
  const [activities, setActivities] = useState([]);
  const [assets, setAssets] = useState([]);
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        // Get the current principal
        const currentPrincipal = await getCurrentPrincipal();
        setPrincipal(currentPrincipal.toString());
        
        // In a real app, you would fetch balance, activities, and assets from your backend
        // For now, we'll use placeholder data
        setBalance('0.00');
        setActivities([
          { id: 1, type: 'reward', amount: '0.5', date: '2023-06-15', description: 'Bounty completion reward' },
          { id: 2, type: 'withdrawal', amount: '1.0', date: '2023-06-10', description: 'Withdrawal to external wallet' },
        ]);
        setAssets([
          { id: 1, name: 'ICP', amount: '0.00', value: '$0.00' },
          { id: 2, name: 'Earnify Token', amount: '0', value: '$0.00' },
        ]);
        
        // Generate placeholder leaderboard data
        const placeholderLeaderboard = [
          { id: 1, name: 'Alice', principal: '2vxsx-fae...', earnings: '125.50', rank: 1 },
          { id: 2, name: 'Bob', principal: '3dxzt-abc...', earnings: '98.75', rank: 2 },
          { id: 3, name: 'Charlie', principal: '4dxzt-def...', earnings: '87.25', rank: 3 },
          { id: 4, name: 'Diana', principal: '5dxzt-ghi...', earnings: '76.50', rank: 4 },
          { id: 5, name: 'Ethan', principal: '6dxzt-jkl...', earnings: '65.25', rank: 5 },
          { id: 6, name: 'Fiona', principal: '7dxzt-mno...', earnings: '54.75', rank: 6 },
          { id: 7, name: 'George', principal: '8dxzt-pqr...', earnings: '43.50', rank: 7 },
          { id: 8, name: 'Hannah', principal: '9dxzt-stu...', earnings: '32.25', rank: 8 },
          { id: 9, name: 'Ian', principal: '0dxzt-vwx...', earnings: '21.00', rank: 9 },
          { id: 10, name: 'Julia', principal: '1dxzt-yza...', earnings: '10.50', rank: 10 },
        ];
        setLeaderboardData(placeholderLeaderboard);
      } catch (error) {
        console.error('Error fetching wallet data:', error);
      }
    };

    if (isOpen && user) {
      fetchWalletData();
    }
  }, [isOpen, user]);

  // Format date to a more readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`fixed top-0 right-0 h-full w-1/3 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-bold text-gray-800">Your Wallet</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Principal ID */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Principal ID</h3>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm font-mono break-all">{principal}</p>
              </div>
            </div>
            
            {/* Balance */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Total Balance</h3>
              <div className="bg-indigo-50 p-4 rounded-md">
                <p className="text-2xl font-bold text-indigo-700">{balance} ICP</p>
                <p className="text-sm text-gray-500">≈ ${(parseFloat(balance) * 5).toFixed(2)} USD</p>
              </div>
            </div>
            
            {/* Assets */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Assets</h3>
              <div className="space-y-2">
                {assets.map(asset => (
                  <div key={asset.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <div>
                      <p className="font-medium">{asset.name}</p>
                      <p className="text-sm text-gray-500">{asset.amount}</p>
                    </div>
                    <p className="font-medium">{asset.value}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Leaderboard */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Top Earners</h3>
              <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
                <div className="grid grid-cols-12 gap-2 p-3 bg-gray-50 text-xs font-medium text-gray-500">
                  <div className="col-span-1">#</div>
                  <div className="col-span-4">Name</div>
                  <div className="col-span-4">Principal</div>
                  <div className="col-span-3 text-right">Earned</div>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {leaderboardData.map((entry) => (
                    <div key={entry.id} className="grid grid-cols-12 gap-2 p-3 border-t border-gray-100 hover:bg-gray-50">
                      <div className="col-span-1 flex items-center">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${
                          entry.rank <= 3 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {entry.rank}
                        </span>
                      </div>
                      <div className="col-span-4 flex items-center font-medium">{entry.name}</div>
                      <div className="col-span-4 flex items-center text-xs text-gray-500 font-mono">{entry.principal}</div>
                      <div className="col-span-3 flex items-center justify-end font-medium text-green-600">
                        {entry.earnings} ICP
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Recent Activity</h3>
              <div className="space-y-2">
                {activities.map(activity => (
                  <div key={activity.id} className="p-3 bg-gray-50 rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{activity.description}</p>
                        <p className="text-xs text-gray-500">{formatDate(activity.date)}</p>
                      </div>
                      <p className={`font-medium ${activity.type === 'reward' ? 'text-green-600' : 'text-red-600'}`}>
                        {activity.type === 'reward' ? '+' : '-'}{activity.amount} ICP
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Disclaimer */}
            <div className="mt-6 p-4 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-700">
                You will receive payments in this wallet each time you win. Learn more about what you can do with your rewards.
              </p>
            </div>
          </div>
          
          {/* Footer */}
          <div className="p-4 border-t">
            <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors">
              Withdraw Funds
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default WalletSidebar; 