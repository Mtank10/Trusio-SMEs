import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../config/api';
import Layout from '../components/Layout/Layout';
import DocumentVerification from '../components/Verification/DocumentVerification';
import { Document } from '../types';
import { Shield } from 'lucide-react';

const Verification: React.FC = () => {
  const { state: authState } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, [authState.token]);

  const fetchDocuments = async () => {
    if (!authState.token) return;

    try {
      setLoading(true);
      setError(null);

      // Get all surveys and their responses to find documents
      const surveysRes = await api.getSurveys(authState.token);
      if (!surveysRes.ok) throw new Error('Failed to fetch surveys');

      const surveys = await surveysRes.json();
      const allDocuments: Document[] = [];

      // Collect documents from all survey responses
      for (const survey of surveys) {
        try {
          const responsesRes = await api.getSurveyResponses(survey.id, authState.token);
          if (responsesRes.ok) {
            const responses = await responsesRes.json();
            responses.forEach((response: any) => {
              if (response.documents) {
                allDocuments.push(...response.documents);
              }
            });
          }
        } catch (error) {
          console.error(`Error fetching responses for survey ${survey.id}:`, error);
        }
      }

      setDocuments(allDocuments);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setError('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyDocument = async (documentId: string) => {
    try {
      const response = await api.verifyDocument(documentId);
      if (!response.ok) throw new Error('Failed to verify document');

      const result = await response.json();
      console.log('Document verification result:', result);

      // Update the document in the list
      setDocuments(docs => 
        docs.map(doc => 
          doc.id === documentId 
            ? { ...doc, verified: result.verified }
            : doc
        )
      );

      alert(result.message);
    } catch (error) {
      console.error('Error verifying document:', error);
      alert('Failed to verify document');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-navy-600">Loading documents...</div>
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
              onClick={fetchDocuments}
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
        <div>
          <h1 className="text-2xl font-bold text-navy-800">Document Verification</h1>
          <p className="text-navy-600">
            Verify the integrity and authenticity of uploaded documents
          </p>
        </div>

        {documents.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-navy-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-navy-400" />
            </div>
            <h3 className="text-lg font-medium text-navy-800 mb-2">No documents to verify</h3>
            <p className="text-navy-600 mb-4">
              Documents uploaded by suppliers will appear here for verification
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-trust-50 rounded-xl border border-trust-200 p-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-trust-600" />
                <div>
                  <h4 className="font-medium text-trust-800">Document Integrity Protection</h4>
                  <p className="text-sm text-trust-700 mt-1">
                    All documents are cryptographically hashed and timestamped for tamper detection.
                    Verification checks ensure documents haven't been modified since upload.
                  </p>
                </div>
              </div>
            </div>

            {documents.map((document) => (
              <DocumentVerification
                key={document.id}
                document={document}
                onVerify={handleVerifyDocument}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Verification;