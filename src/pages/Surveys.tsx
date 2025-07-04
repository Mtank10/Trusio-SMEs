import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../config/api';
import Layout from '../components/Layout/Layout';
import SurveyForm from '../components/Surveys/SurveyForm';
import { Survey, Product } from '../types';
import { Plus, FileText, Users, Calendar, Send } from 'lucide-react';

const Surveys: React.FC = () => {
  const { state: authState } = useAuth();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSurvey, setEditingSurvey] = useState<Survey | undefined>();
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [authState.token]);

  const fetchData = async () => {
    if (!authState.token) return;

    try {
      setLoading(true);
      setError(null);

      const [surveysRes, productsRes] = await Promise.all([
        api.getSurveys(authState.token),
        api.getProducts(authState.token),
      ]);

      if (!surveysRes.ok || !productsRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const surveysData = await surveysRes.json();
      const productsData = await productsRes.json();

      setSurveys(surveysData);
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load surveys');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSurvey = () => {
    if (products.length === 0) {
      alert('Please add a product first before creating surveys');
      return;
    }
    setEditingSurvey(undefined);
    setSelectedProductId(products[0].id);
    setShowForm(true);
  };

  const handleEditSurvey = (survey: Survey) => {
    setEditingSurvey(survey);
    setSelectedProductId(survey.productId);
    setShowForm(true);
  };

  const handleSaveSurvey = async (surveyData: Partial<Survey>) => {
    if (!authState.token) return;

    try {
      if (editingSurvey) {
        // Update existing survey - would need API endpoint
        console.log('Update survey:', editingSurvey.id, surveyData);
      } else {
        // Add new survey
        const response = await api.createSurvey(surveyData, authState.token);
        if (!response.ok) throw new Error('Failed to create survey');
      }
      
      await fetchData(); // Refresh the list
      setShowForm(false);
    } catch (error) {
      console.error('Error saving survey:', error);
      alert('Failed to save survey');
    }
  };

  const handleSendToSuppliers = async (surveyId: string) => {
    if (!authState.token) return;

    try {
      // Get suppliers for this survey's product
      const survey = surveys.find(s => s.id === surveyId);
      if (!survey) return;

      const product = products.find(p => p.id === survey.productId);
      if (!product || !product.suppliers || product.suppliers.length === 0) {
        alert('No suppliers found for this product');
        return;
      }

      // Send invitations to all suppliers
      for (const supplier of product.suppliers) {
        await api.inviteSupplier({
          supplierEmail: supplier.email,
          surveyId: surveyId,
        }, authState.token);
      }

      alert(`Survey sent to ${product.suppliers.length} suppliers`);
    } catch (error) {
      console.error('Error sending survey:', error);
      alert('Failed to send survey to suppliers');
    }
  };

  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product?.name || 'Unknown Product';
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-navy-600">Loading surveys...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-600 mb-2">{error}</div>
            <button
              onClick={fetchData}
              className="px-4 py-2 bg-trust-600 text-white rounded-lg hover:bg-trust-700"
            >
              Retry
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-navy-800">Surveys</h1>
            <p className="text-navy-600">
              Create and manage data collection surveys for your suppliers
            </p>
          </div>
          <button
            onClick={handleAddSurvey}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-trust-600 to-energy-600 text-white rounded-lg hover:from-trust-700 hover:to-energy-700 transition-all shadow-trust"
          >
            <Plus className="w-4 h-4" />
            <span>Create Survey</span>
          </button>
        </div>

        {surveys.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-navy-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-navy-400" />
            </div>
            <h3 className="text-lg font-medium text-navy-800 mb-2">No surveys yet</h3>
            <p className="text-navy-600 mb-4">
              Create your first survey to start collecting supplier data
            </p>
            <button
              onClick={handleAddSurvey}
              className="px-4 py-2 bg-gradient-to-r from-trust-600 to-energy-600 text-white rounded-lg hover:from-trust-700 hover:to-energy-700 transition-all"
            >
              Create Your First Survey
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {surveys.map((survey) => (
              <div key={survey.id} className="bg-white rounded-xl shadow-sm border border-navy-200 p-6 hover:shadow-trust transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-navy-800">
                      {getProductName(survey.productId)} - Tier {survey.supplierTier} Survey
                    </h3>
                    <p className="text-sm text-navy-600 mt-1">
                      {survey.questions.length} questions
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-1 text-sm text-navy-600">
                        <Calendar className="w-4 h-4" />
                        <span>Created {new Date(survey.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-navy-600">
                        <Users className="w-4 h-4" />
                        <span>{survey.responses?.length || 0} responses</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditSurvey(survey)}
                      className="px-3 py-1 text-sm text-trust-600 hover:text-trust-700 font-medium"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleSendToSuppliers(survey.id)}
                      className="flex items-center space-x-1 px-3 py-1 text-sm bg-gradient-to-r from-trust-600 to-energy-600 text-white rounded-lg hover:from-trust-700 hover:to-energy-700 transition-all"
                    >
                      <Send className="w-3 h-3" />
                      <span>Send to Suppliers</span>
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