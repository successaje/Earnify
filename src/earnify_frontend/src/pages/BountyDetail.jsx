import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBounty, submitBounty } from '../utils/ic';
import { Principal } from '@dfinity/principal';

const BountyDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [bounty, setBounty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [submissionError, setSubmissionError] = useState(null);
    const [description, setDescription] = useState('');
    const [attachments, setAttachments] = useState([]);

    useEffect(() => {
        const loadBounty = async () => {
            try {
                setLoading(true);
                const result = await getBounty(id);
                console.log('Bounty data:', result);
                
                // Check if result is an error or success
                if (result.err) {
                    setError(result.err);
                    setBounty(null);
                } else {
                    // Convert Principal objects to strings
                    const processedBounty = {
                        ...result.ok,
                        postedBy: result.ok.postedBy.toText(),
                        submissions: result.ok.submissions.map(sub => ({
                            ...sub,
                            submitter: sub.submitter.toText()
                        }))
                    };
                    setBounty(processedBounty);
                }
            } catch (error) {
                console.error('Error loading bounty:', error);
                setError('Failed to load bounty details. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        loadBounty();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!description.trim()) {
            setSubmissionError('Please provide a description for your submission');
            return;
        }

        try {
            setSubmitting(true);
            setSubmissionError(null);
            await submitBounty(id, description, attachments);
            navigate('/bounties');
        } catch (error) {
            console.error('Error submitting to bounty:', error);
            setSubmissionError('Failed to submit to bounty. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setAttachments(files.map(file => file.name));
    };

    if (loading) {
        return <div className="text-center py-8">Loading bounty details...</div>;
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Error!</strong>
                        <span className="block sm:inline"> {error}</span>
                    </div>
                    <div className="mt-4">
                        <button
                            onClick={() => navigate('/bounties')}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Back to Bounties
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!bounty) {
        return <div className="text-center py-8">Bounty not found</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-4">{bounty.title || 'Untitled Bounty'}</h1>
                    <div className="flex items-center gap-4 mb-4">
                        <span className={`px-3 py-1 rounded-full text-white bg-${bounty.status === 'open' ? 'green' : 'gray'}-500`}>
                            {bounty.status || 'unknown'}
                        </span>
                        <span className="text-gray-600">
                            Posted by {bounty.postedBy || 'Unknown'}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <h2 className="text-xl font-semibold mb-4">Description</h2>
                            <p className="text-gray-700 whitespace-pre-wrap">{bounty.description || 'No description provided'}</p>
                        </div>

                        {bounty.status === 'open' && (
                            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                                <h2 className="text-xl font-semibold mb-4">Submit Your Solution</h2>
                                {submissionError && (
                                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                                        <span className="block sm:inline">{submissionError}</span>
                                    </div>
                                )}
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                                            Description
                                        </label>
                                        <textarea
                                            id="description"
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            rows="6"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Describe your solution..."
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="attachments">
                                            Attachments
                                        </label>
                                        <input
                                            type="file"
                                            id="attachments"
                                            multiple
                                            onChange={handleFileChange}
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            {submitting ? 'Submitting...' : 'Submit Solution'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>

                    <div className="md:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <h2 className="text-xl font-semibold mb-4">Reward</h2>
                            <div className="text-2xl font-bold text-blue-600 mb-2">
                                {bounty.reward || 0} {bounty.currency || 'ICP'}
                            </div>
                            <div className="text-gray-600">
                                Deadline: {bounty.deadline ? (() => {
                                    const timestampNum = typeof bounty.deadline === 'bigint' ? Number(bounty.deadline) : bounty.deadline;
                                    return new Date(timestampNum).toLocaleDateString();
                                })() : 'No deadline set'}
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <h2 className="text-xl font-semibold mb-4">Required Skills</h2>
                            <div className="flex flex-wrap gap-2">
                                {bounty.skills?.map((skill, index) => (
                                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <button
                        onClick={() => navigate('/bounties')}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Back to Bounties
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BountyDetail; 