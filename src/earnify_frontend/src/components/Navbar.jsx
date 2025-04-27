import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import WalletSidebar from './WalletSidebar';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleWallet = () => {
    setIsWalletOpen(!isWalletOpen);
  };

  return (
    <>
      <nav className="bg-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-indigo-600">Earnify</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/jobs" className="text-gray-700 hover:text-indigo-600">
                Jobs
              </Link>
              <Link to="/bounties" className="text-gray-700 hover:text-indigo-600">
                Bounties
              </Link>
              {user ? (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={toggleWallet}
                    className="text-gray-700 hover:text-indigo-600 flex items-center"
                    title="Wallet"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </button>
                  <Link
                    to="/profile"
                    className="text-gray-700 hover:text-indigo-600"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Navigation Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-indigo-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link
                  to="/jobs"
                  className="block px-3 py-2 text-gray-700 hover:text-indigo-600"
                >
                  Jobs
                </Link>
                <Link
                  to="/bounties"
                  className="block px-3 py-2 text-gray-700 hover:text-indigo-600"
                >
                  Bounties
                </Link>
                {user ? (
                  <>
                    <button
                      onClick={toggleWallet}
                      className="block w-full text-left px-3 py-2 text-gray-700 hover:text-indigo-600"
                    >
                      Wallet
                    </button>
                    <Link
                      to="/profile"
                      className="block px-3 py-2 text-gray-700 hover:text-indigo-600"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-2 text-gray-700 hover:text-indigo-600"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-gray-700 hover:text-indigo-600"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Wallet Sidebar */}
      <WalletSidebar isOpen={isWalletOpen} onClose={() => setIsWalletOpen(false)} user={user} />
    </>
  );
};

export default Navbar; 