import React, { useState } from 'react';
import { Survey, SurveyQuestion } from '../../types';
import { X, Plus, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface SurveyFormProps {
  survey?: Survey;
  productId: string;
  onSave: (survey: Partial<Survey>) => void;
  onCancel: () => void;
}

const SurveyForm: React.FC<SurveyFormProps> = ({ 
  survey, 
  productId, 
  onSave, 
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    productId: productId,
    supplierTier: survey?.supplierTier || 1,
    questions: survey?.questions || [],
  });

  const addQuestion = () => {
    const newQuestion: SurveyQuestion = {
      id: uuidv4(),
      type: 'text',
      question: '',
      required: false,
      category: 'general',
    };
    setFormData({
      ...formData,
      questions: [...formData.questions, newQuestion],
    });
  };

  const updateQuestion = (index: number, updatedQuestion: Partial<SurveyQuestion>) => {
    const questions = [...formData.questions];
    questions[index] = { ...questions[index], ...updatedQuestion };
    setFormData({ ...formData, questions });
  };

  const removeQuestion = (index: number) => {
    const questions = formData.questions.filter((_, i) => i !== index);
    setFormData({ ...formData, questions });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {survey ? 'Edit Survey' : 'Create New Survey'}
          </h3>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="supplierTier" className="block text-sm font-medium text-gray-700">
              Supplier Tier
            </label>
            <select
              id="supplierTier"
              value={formData.supplierTier}
              onChange={(e) => setFormData({ ...formData, supplierTier: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value={1}>Tier 1 (Direct)</option>
              <option value={2}>Tier 2</option>
              <option value={3}>Tier 3</option>
              <option value={4}>Tier 4</option>
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-gray-900">Survey Questions</h4>
              <button
                type="button"
                onClick={addQuestion}
                className="flex items-center space-x-2 px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Question</span>
              </button>
            </div>

            <div className="space-y-4">
              {formData.questions.map((question, index) => (
                <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Question
                        </label>
                        <input
                          type="text"
                          value={question.question}
                          onChange={(e) => updateQuestion(index, { question: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          placeholder="Enter your question..."
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Type
                          </label>
                          <select
                            value={question.type}
                            onChange={(e) => updateQuestion(index, { type: e.target.value as SurveyQuestion['type'] })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          >
                            <option value="text">Text</option>
                            <option value="select">Select</option>
                            <option value="multiselect">Multi-select</option>
                            <option value="file">File Upload</option>
                            <option value="date">Date</option>
                            <option value="number">Number</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Category
                          </label>
                          <select
                            value={question.category}
                            onChange={(e) => updateQuestion(index, { category: e.target.value as SurveyQuestion['category'] })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          >
                            <option value="general">General</option>
                            <option value="environmental">Environmental</option>
                            <option value="social">Social</option>
                            <option value="governance">Governance</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={question.required}
                          onChange={(e) => updateQuestion(index, { required: e.target.checked })}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700">
                          Required
                        </label>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeQuestion(index)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors ml-4"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {survey ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SurveyForm;