import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllBounties } from '../utils/ic';

function Bounties() {
    const [bounties, setBounties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all'); // 'all', 'open', 'closed'

    useEffect(() => {
        const fetchBounties = async () => {
            try {
                const data = await getAllBounties();
                setBounties(data);
            } catch (err) {
                setError('Failed to load bounties. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchBounties();
    }, []);

    const filteredBounties = bounties.filter((bounty) => {
        if (filter === 'all') return true;
        return bounty.status === filter;
    });

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

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Bounties</h1>
                <Link
                    to="/bounties/create"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                    Create Bounty
                </Link>
            </div>

            <div className="mb-6">
                <div className="flex space-x-4">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-md ${
                            filter === 'all'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('open')}
                        className={`px-4 py-2 rounded-md ${
                            filter === 'open'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        Open
                    </button>
                    <button
                        onClick={() => setFilter('closed')}
                        className={`px-4 py-2 rounded-md ${
                            filter === 'closed'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        Closed
                    </button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredBounties.map((bounty) => (
                    <Link
                        key={bounty.id}
                        to={`/bounties/${bounty.id}`}
                        className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200"
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {bounty.title}
                                </h2>
                                <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        bounty.status === 'open'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}
                                >
                                    {bounty.status.charAt(0).toUpperCase() + bounty.status.slice(1)}
                                </span>
                            </div>
                            <p className="text-gray-600 mb-4 line-clamp-2">
                                {bounty.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {bounty.skills.slice(0, 3).map((skill, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                                    >
                                        {skill}
                                    </span>
                                ))}
                                {bounty.skills.length > 3 && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                        +{bounty.skills.length - 3} more
                                    </span>
                                )}
                            </div>
                            <div className="flex justify-between items-center text-sm text-gray-500">
                                <span>{bounty.reward} ICP</span>
                                <span>Due {formatDate(bounty.deadline)}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {filteredBounties.length === 0 && (
                <div className="text-center text-gray-600 py-8">
                    No bounties found.
                </div>
            )}
        </div>
    );
}

export default Bounties; 