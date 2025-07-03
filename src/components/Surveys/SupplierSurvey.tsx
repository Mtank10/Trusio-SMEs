import React, { useState } from 'react';
import { Survey, SurveyQuestion, SurveyResponse } from '../../types';
import { Upload, File, CheckCircle } from 'lucide-react';

interface SupplierSurveyProps {
  survey: Survey;
  onSubmit: (response: Partial<SurveyResponse>) => void;
}

const SupplierSurvey: React.FC<SupplierSurveyProps> = ({ survey, onSubmit }) => {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File>>({});

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleFileUpload = (questionId: string, file: File) => {
    setUploadedFiles({ ...uploadedFiles, [questionId]: file });
    setAnswers({ ...answers, [questionId]: file.name });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      surveyId: survey.id,
      answers,
      status: 'submitted',
    });
  };

  const renderQuestion = (question: SurveyQuestion) => {
    switch (question.type) {
      case 'text':
        return (
          <input
            type="text"
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required={question.required}
          />
        );

      case 'select':
        return (
          <select
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required={question.required}
          >
            <option value="">Select an option</option>
            {question.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'file':
        return (
          <div className="mt-1">
            <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                    <span>Upload a file</span>
                    <input
                      type="file"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileUpload(question.id, file);
                        }
                      }}
                      required={question.required}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p>
              </div>
            </div>
            {uploadedFiles[question.id] && (
              <div className="mt-2 flex items-center space-x-2 text-sm text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span>{uploadedFiles[question.id].name}</span>
              </div>
            )}
          </div>
        );

      case 'date':
        return (
          <input
            type="date"
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required={question.required}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required={question.required}
          />
        );

      default:
        return null;
    }
  };

  const getCategoryColor = (category: SurveyQuestion['category']) => {
    switch (category) {
      case 'environmental':
        return 'bg-green-50 text-green-800';
      case 'social':
        return 'bg-blue-50 text-blue-800';
      case 'governance':
        return 'bg-purple-50 text-purple-800';
      default:
        return 'bg-gray-50 text-gray-800';
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Supply Chain Survey</h2>
        <p className="text-sm text-gray-600 mt-1">
          Please provide the requested information about your company and operations.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {survey.questions.map((question) => (
          <div key={question.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                {question.question}
                {question.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(question.category)}`}>
                {question.category}
              </span>
            </div>
            {renderQuestion(question)}
          </div>
        ))}

        <div className="flex justify-end pt-6">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Submit Survey
          </button>
        </div>
      </form>
    </div>
  );
};

export default SupplierSurvey;