import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Survey, SurveyResponse } from '../types';
import SupplierSurvey from '../components/Surveys/SupplierSurvey';
import { CheckCircle, Building, ArrowLeft } from 'lucide-react';

const SupplierPortal: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      fetchSurvey();
    } else {
      // Show demo survey if no token
      setSurvey(mockSurvey);
      setLoading(false);
    }
  }, [token]);

  const fetchSurvey = async () => {
    if (!token) return;

    try {
      setLoading(true);
      // In real app, would fetch survey using token
      // For demo, use mock data
      setSurvey(mockSurvey);
    } catch (error) {
      console.error('Error fetching survey:', error);
      setError('Failed to load survey');
    } finally {
      setLoading(false);
    }
  };

  // Mock survey data for demonstration
  const mockSurvey: Survey = {
    id: '1',
    productId: '1',
    supplierTier: 1,
    questions: [
      {
        id: '1',
        type: 'text',
        question: 'What is your company name?',
        required: true,
        category: 'general',
      },
      {
        id: '2',
        type: 'text',
        question: 'What is your GST registration number?',
        required: true,
        category: 'general',
      },
      {
        id: '3',
        type: 'select',
        question: 'What is your primary industry?',
        options: ['Manufacturing', 'Agriculture', 'Technology', 'Services', 'Textiles', 'Pharmaceuticals'],
        required: true,
        category: 'general',
      },
      {
        id: '4',
        type: 'file',
        question: 'Please upload your ISO 14001 certification (if available)',
        required: false,
        category: 'environmental',
      },
      {
        id: '5',
        type: 'text',
        question: 'Describe your environmental sustainability practices',
        required: false,
        category: 'environmental',
      },
      {
        id: '6',
        type: 'number',
        question: 'How many employees does your company have?',
        required: true,
        category: 'social',
      },
      {
        id: '7',
        type: 'select',
        question: 'Do you have MSME registration?',
        options: ['Yes', 'No', 'Applied'],
        required: true,
        category: 'governance',
      },
      {
        id: '8',
        type: 'file',
        question: 'Upload your company registration certificate',
        required: true,
        category: 'governance',
      },
    ],
    createdBy: '1',
    createdAt: new Date(),
  };

  const handleSubmitSurvey = (response: Partial<SurveyResponse>) => {
    console.log('Survey submitted:', response);
    setIsSubmitted(true);
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-trust-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-navy-600">Loading survey...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <button
            onClick={handleBackToLogin}
            className="px-4 py-2 bg-trust-600 text-white rounded-lg hover:bg-trust-700"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Survey Submitted Successfully!
          </h2>
          <p className="text-gray-600 mb-4">
            Thank you for providing your supply chain information. Your data has been securely recorded and will be verified.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            You will receive a confirmation email shortly with your submission details.
          </p>
          <button
            onClick={handleBackToLogin}
            className="flex items-center space-x-2 px-4 py-2 bg-trust-600 text-white rounded-lg hover:bg-trust-700 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Platform</span>
          </button>
        </div>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="text-navy-600 mb-4">No survey found</div>
          <button
            onClick={handleBackToLogin}
            className="px-4 py-2 bg-trust-600 text-white rounded-lg hover:bg-trust-700"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-trust-600 to-energy-600 rounded-lg flex items-center justify-center mr-3 shadow-trust">
              <Building className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Supply Chain Transparency Portal
            </h1>
          </div>
          <p className="text-gray-600 mb-2">
            Complete this survey to help us maintain transparency in our supply chain
          </p>
          <p className="text-sm text-trust-600">
            आपूर्ति श्रृंखला पारदर्शिता के लिए यह सर्वेक्षण पूरा करें
          </p>
          
          {!token && (
            <div className="mt-4 p-3 bg-energy-50 border border-energy-200 rounded-lg">
              <p className="text-sm text-energy-700">
                <strong>Demo Mode:</strong> This is a demonstration of the supplier portal. 
                In production, suppliers would access this via a secure link.
              </p>
            </div>
          )}
        </div>

        <SupplierSurvey
          survey={survey}
          onSubmit={handleSubmitSurvey}
        />

        <div className="mt-8 text-center">
          <button
            onClick={handleBackToLogin}
            className="flex items-center space-x-2 px-4 py-2 text-trust-600 hover:text-trust-700 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Platform</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupplierPortal;