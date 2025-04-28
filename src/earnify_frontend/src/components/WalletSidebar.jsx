import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
// Import token logos
import icpLogo from '../assets/icp.png';
import ckBTCLogo from '../assets/ckBTC.png';
import ckETHLogo from '../assets/ckETH.png';
import ckUSDLogo from '../assets/ckUSDC.png';

const WalletSidebar = ({ isOpen, onClose, user }) => {
  const [balances, setBalances] = useState({
    icp: '0.00',
    ckusd: '0.00',
    ckbtc: '0.00',
    cketh: '0.00'
  });
  const [activities, setActivities] = useState([]);
  const [assets, setAssets] = useState([]);

  // Mock data for demonstration
  useEffect(() => {
    if (isOpen) {
      // In a real app, you would fetch this data from your backend
      setBalances({
        icp: '1,234.56',
        ckusd: '5,678.90',
        ckbtc: '0.5',
        cketh: '2.5'
      });
      
      setActivities([
        { id: 1, type: 'received', amount: '500.00', token: 'ICP', from: '0x1234...5678', date: '2023-05-01' },
        { id: 2, type: 'sent', amount: '100.00', token: 'ICP', to: '0x8765...4321', date: '2023-05-02' },
        { id: 3, type: 'received', amount: '750.00', token: 'ckUSD', from: '0x2468...1357', date: '2023-05-03' },
        { id: 4, type: 'earned', amount: '0.05', token: 'ckBTC', from: 'Job #1234', date: '2023-05-04' },
        { id: 5, type: 'earned', amount: '1.25', token: 'ckETH', from: 'Bounty #5678', date: '2023-05-05' },
      ]);
      
      setAssets([
        { id: 1, name: 'ICP', symbol: 'ICP', balance: '1,234.56', value: '$12,345.60', logo: icpLogo },
        { id: 2, name: 'CKBTC', symbol: 'ckBTC', balance: '0.5', value: '$15,000.00', logo: ckBTCLogo },
        { id: 3, name: 'CKETH', symbol: 'ckETH', balance: '2.5', value: '$5,000.00', logo: ckETHLogo },
        { id: 4, name: 'CKUSD', symbol: 'ckUSD', balance: '5,678.90', value: '$5,678.90', logo: ckUSDLogo },
      ]);
    }
  }, [isOpen]);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.wallet-sidebar')) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Prevent body scrolling when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Convert Principal to string if it's an object
  const getPrincipalText = () => {
    if (!user?.principal) return 'Not connected';
    
    // If principal is already a string, return it
    if (typeof user.principal === 'string') return user.principal;
    
    // If principal is an object with toText method, call it
    if (user.principal && typeof user.principal.toText === 'function') {
      return user.principal.toText();
    }
    
    // If principal is an object with _arr property (Principal object)
    if (user.principal && user.principal._arr) {
      try {
        return user.principal.toText();
      } catch (e) {
        console.error('Error converting principal to text:', e);
        return 'Invalid principal';
      }
    }
    
    // Fallback
    return 'Unknown principal format';
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
        className={`fixed top-0 right-0 h-full w-1/3 max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out wallet-sidebar ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Wallet</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Wallet Info */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Wallet Name</h3>
              <p className="text-lg font-semibold text-gray-800">My Earnify Wallet</p>
              
              <h3 className="text-sm font-medium text-gray-500 mt-4 mb-1">Principal ID</h3>
              <p className="text-sm font-mono text-gray-800 break-all">
                {getPrincipalText()}
              </p>
              
              <h3 className="text-sm font-medium text-gray-500 mt-4 mb-1">Total Balance</h3>
              <p className="text-2xl font-bold text-indigo-600">$38,024.50</p>
            </div>

            {/* Assets */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Assets</h3>
              <div className="space-y-3">
                {assets.map((asset) => (
                  <div key={asset.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="mr-3">
                        <img src={asset.logo} alt={asset.name} className="h-8 w-8 object-contain" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{asset.name}</p>
                        <p className="text-sm text-gray-500">{asset.balance}</p>
                      </div>
                    </div>
                    <p className="font-semibold text-gray-800">{asset.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Recent Activity</h3>
              <div className="space-y-3">
                {activities.map((activity) => (
                  <div key={activity.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-sm font-medium ${
                        activity.type === 'received' || activity.type === 'earned' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {activity.type === 'received' ? 'Received' : activity.type === 'earned' ? 'Earned' : 'Sent'}
                      </span>
                      <span className="text-sm font-medium text-gray-800">{activity.amount} {activity.token}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {activity.type === 'earned' ? `From: ${activity.from}` : 
                       activity.type === 'received' ? `From: ${activity.from}` : `To: ${activity.to}`}
                    </div>
                    <div className="text-xs text-gray-500">{activity.date}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-auto p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">
                By using this wallet, you acknowledge that you are responsible for the security of your funds. 
                Earnify is not responsible for any loss of funds due to unauthorized access or other security issues.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WalletSidebar; 