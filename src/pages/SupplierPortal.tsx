import React, { useState } from 'react';
import { Survey, SurveyResponse } from '../types';
import SupplierSurvey from '../components/Surveys/SupplierSurvey';
import { CheckCircle, Building } from 'lucide-react';

const SupplierPortal: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

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
        type: 'select',
        question: 'What is your primary industry?',
        options: ['Manufacturing', 'Agriculture', 'Technology', 'Services'],
        required: true,
        category: 'general',
      },
      {
        id: '3',
        type: 'file',
        question: 'Please upload your ISO 14001 certification',
        required: true,
        category: 'environmental',
      },
      {
        id: '4',
        type: 'text',
        question: 'Describe your environmental sustainability practices',
        required: false,
        category: 'environmental',
      },
      {
        id: '5',
        type: 'number',
        question: 'How many employees does your company have?',
        required: true,
        category: 'social',
      },
    ],
    createdBy: '1',
    createdAt: new Date(),
  };

  const handleSubmitSurvey = (response: Partial<SurveyResponse>) => {
    console.log('Survey submitted:', response);
    setIsSubmitted(true);
  };

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
          <p className="text-sm text-gray-500">
            You will receive a confirmation email shortly with your submission details.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
              <Building className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Supply Chain Transparency Portal
            </h1>
          </div>
          <p className="text-gray-600">
            Complete this survey to help us maintain transparency in our supply chain
          </p>
        </div>

        <SupplierSurvey
          survey={mockSurvey}
          onSubmit={handleSubmitSurvey}
        />
      </div>
    </div>
  );
};

export default SupplierPortal;