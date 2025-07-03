import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import Layout from '../components/Layout/Layout';
import SurveyForm from '../components/Surveys/SurveyForm';
import { Survey } from '../types';
import { Plus, FileText, Users, Calendar } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const Surveys: React.FC = () => {
  const { state, dispatch } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingSurvey, setEditingSurvey] = useState<Survey | undefined>();
  const [selectedProductId, setSelectedProductId] = useState<string>('');

  const handleAddSurvey = () => {
    if (state.products.length === 0) {
      alert('Please add a product first before creating surveys');
      return;
    }
    setEditingSurvey(undefined);
    setSelectedProductId(state.products[0].id);
    setShowForm(true);
  };

  const handleEditSurvey = (survey: Survey) => {
    setEditingSurvey(survey);
    setSelectedProductId(survey.productId);
    setShowForm(true);
  };

  const handleSaveSurvey = (surveyData: Partial<Survey>) => {
    if (editingSurvey) {
      // Update existing survey
      const updatedSurvey = { ...editingSurvey, ...surveyData };
      dispatch({ type: 'SET_SURVEYS', payload: state.surveys.map(s => s.id === editingSurvey.id ? updatedSurvey : s) });
    } else {
      // Add new survey
      const newSurvey: Survey = {
        id: uuidv4(),
        productId: selectedProductId,
        supplierTier: surveyData.supplierTier!,
        questions: surveyData.questions!,
        createdBy: state.user?.id || '',
        createdAt: new Date(),
      };
      dispatch({ type: 'ADD_SURVEY', payload: newSurvey });
    }
    setShowForm(false);
  };

  const getProductName = (productId: string) => {
    const product = state.products.find(p => p.id === productId);
    return product?.name || 'Unknown Product';
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Surveys</h1>
            <p className="text-gray-600">
              Create and manage data collection surveys for your suppliers
            </p>
          </div>
          <button
            onClick={handleAddSurvey}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Survey</span>
          </button>
        </div>

        {state.surveys.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No surveys yet</h3>
            <p className="text-gray-600 mb-4">
              Create your first survey to start collecting supplier data
            </p>
            <button
              onClick={handleAddSurvey}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Create Your First Survey
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {state.surveys.map((survey) => (
              <div key={survey.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {getProductName(survey.productId)} - Tier {survey.supplierTier} Survey
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {survey.questions.length} questions
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>Created {survey.createdAt.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>0 responses</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditSurvey(survey)}
                      className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Edit
                    </button>
                    <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                      Send to Suppliers
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showForm && (
          <SurveyForm
            survey={editingSurvey}
            productId={selectedProductId}
            onSave={handleSaveSurvey}
            onCancel={() => setShowForm(false)}
          />
        )}
      </div>
    </Layout>
  );
};

export default Surveys;