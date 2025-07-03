import React from 'react';
import { useApp } from '../contexts/AppContext';
import Layout from '../components/Layout/Layout';
import DocumentVerification from '../components/Verification/DocumentVerification';
import { Document } from '../types';
import { Shield } from 'lucide-react';

const Verification: React.FC = () => {
  const { state } = useApp();

  // Mock documents data for demonstration
  const mockDocuments: Document[] = [
    {
      id: '1',
      surveyResponseId: '1',
      originalFilename: 'ISO_14001_Certificate.pdf',
      storagePath: '/documents/iso-cert-1.pdf',
      hashSha256: 'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
      timestamp: new Date(),
      verified: true,
      fileSize: 1024576,
      mimeType: 'application/pdf',
      blockchainAnchorTxId: '0x1234567890abcdef',
    },
    {
      id: '2',
      surveyResponseId: '2',
      originalFilename: 'Supplier_Audit_Report.pdf',
      storagePath: '/documents/audit-report-1.pdf',
      hashSha256: 'b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      verified: false,
      fileSize: 2048576,
      mimeType: 'application/pdf',
    },
  ];

  const handleVerifyDocument = (documentId: string) => {
    // In real app, would perform cryptographic verification
    console.log('Verifying document:', documentId);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Document Verification</h1>
          <p className="text-gray-600">
            Verify the integrity and authenticity of uploaded documents
          </p>
        </div>

        {mockDocuments.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No documents to verify</h3>
            <p className="text-gray-600 mb-4">
              Documents uploaded by suppliers will appear here for verification
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {mockDocuments.map((document) => (
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