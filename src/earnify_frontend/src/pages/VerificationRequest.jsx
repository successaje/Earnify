import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-hot-toast';
import { getCurrentPrincipal } from '../utils/ic';

const VerificationRequest = () => {
  const [formData, setFormData] = useState({
    organizationName: '',
    organizationType: 'company',
    description: '',
    website: '',
    documents: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [existingRequest, setExistingRequest] = useState(null);
  const { user, submitVerificationRequest, getUserVerificationRequest } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkExistingRequest = async () => {
      if (user) {
        try {
          const principal = await getCurrentPrincipal();
          const request = await getUserVerificationRequest(principal);
          if (request) {
            setExistingRequest(request);
          }
        } catch (err) {
          console.error('Error checking verification request:', err);
        }
      }
    };

    checkExistingRequest();
  }, [user, getUserVerificationRequest]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    // In a real implementation, you would upload these files to a storage service
    // and get back URLs or hashes to store
    const fileNames = files.map(file => file.name);
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, ...fileNames]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await submitVerificationRequest({
        organizationName: formData.organizationName,
        organizationType: formData.organizationType,
        description: formData.description,
        website: formData.website ? formData.website : null,
        documents: formData.documents
      });

      if (result) {
        toast.success('Verification request submitted successfully!');
        navigate('/profile');
      }
    } catch (err) {
      console.error('Error submitting verification request:', err);
      setError(err.message || 'Failed to submit verification request');
      toast.error(err.message || 'Failed to submit verification request');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Authentication Required
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please sign in to submit a verification request.
          </p>
          <div className="mt-6">
            <button
              onClick={() => navigate('/login')}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (existingRequest) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verification Request Status
          </h2>
          <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                {existingRequest.organizationName}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {existingRequest.organizationType}
              </p>
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700">Status</h4>
              <div className="mt-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  existingRequest.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  existingRequest.status === 'approved' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {existingRequest.status.charAt(0).toUpperCase() + existingRequest.status.slice(1)}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700">Description</h4>
              <p className="mt-1 text-sm text-gray-500">
                {existingRequest.description}
              </p>
            </div>

            {existingRequest.website && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700">Website</h4>
                <a
                  href={existingRequest.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 text-sm text-blue-600 hover:text-blue-500"
                >
                  {existingRequest.website}
                </a>
              </div>
            )}

            {existingRequest.documents.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700">Documents</h4>
                <ul className="mt-1 text-sm text-gray-500">
                  {existingRequest.documents.map((doc, index) => (
                    <li key={index}>{doc}</li>
                  ))}
                </ul>
              </div>
            )}

            {existingRequest.notes && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700">Notes</h4>
                <p className="mt-1 text-sm text-gray-500">
                  {existingRequest.notes}
                </p>
              </div>
            )}

            <div className="mt-6">
              <button
                onClick={() => navigate('/profile')}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back to Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Request Verification
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Submit a request to verify your account as a sponsor or earner
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700">
                Organization Name
              </label>
              <div className="mt-1">
                <input
                  id="organizationName"
                  name="organizationName"
                  type="text"
                  required
                  value={formData.organizationName}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="organizationType" className="block text-sm font-medium text-gray-700">
                Organization Type
              </label>
              <div className="mt-1">
                <select
                  id="organizationType"
                  name="organizationType"
                  required
                  value={formData.organizationType}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="company">Company</option>
                  <option value="nonprofit">Nonprofit</option>
                  <option value="educational">Educational Institution</option>
                  <option value="individual">Individual</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <div className="mt-1">
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  required
                  value={formData.description}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Describe your organization and why you're requesting verification"
                />
              </div>
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                Website (Optional)
              </label>
              <div className="mt-1">
                <input
                  id="website"
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="documents" className="block text-sm font-medium text-gray-700">
                Supporting Documents (Optional)
              </label>
              <div className="mt-1">
                <input
                  id="documents"
                  name="documents"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Upload documents that support your verification request (e.g., business registration, website screenshots)
                </p>
              </div>
              {formData.documents.length > 0 && (
                <div className="mt-2">
                  <h4 className="text-xs font-medium text-gray-700">Selected files:</h4>
                  <ul className="mt-1 text-xs text-gray-500">
                    {formData.documents.map((doc, index) => (
                      <li key={index}>{doc}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {loading ? 'Submitting...' : 'Submit Verification Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerificationRequest; 