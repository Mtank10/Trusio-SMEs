import React, { useState } from 'react';
import { Document } from '../../types';
import { Shield, CheckCircle, AlertTriangle, Clock, FileText } from 'lucide-react';

interface DocumentVerificationProps {
  document: Document;
  onVerify: (documentId: string) => void;
}

const DocumentVerification: React.FC<DocumentVerificationProps> = ({ 
  document, 
  onVerify 
}) => {
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    setIsVerifying(true);
    // Simulate verification process
    await new Promise(resolve => setTimeout(resolve, 2000));
    onVerify(document.id);
    setIsVerifying(false);
  };

  const getStatusIcon = () => {
    if (isVerifying) return Clock;
    return document.verified ? CheckCircle : AlertTriangle;
  };

  const getStatusColor = () => {
    if (isVerifying) return 'text-blue-600';
    return document.verified ? 'text-green-600' : 'text-yellow-600';
  };

  const StatusIcon = getStatusIcon();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-gray-50 rounded-lg">
            <FileText className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {document.originalFilename}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {document.mimeType} • {Math.round(document.fileSize / 1024)} KB
            </p>
          </div>
        </div>
        <div className={`flex items-center space-x-1 ${getStatusColor()}`}>
          <StatusIcon className="w-5 h-5" />
          <span className="text-sm font-medium">
            {isVerifying ? 'Verifying...' : document.verified ? 'Verified' : 'Unverified'}
          </span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">SHA-256 Hash</p>
          <p className="text-xs font-mono text-gray-900 mt-1 break-all">
            {document.hashSha256}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Timestamp</p>
          <p className="text-sm text-gray-900 mt-1">
            {document.timestamp.toLocaleString()}
          </p>
        </div>
      </div>

      {document.blockchainAnchorTxId && (
        <div className="mt-4">
          <p className="text-sm text-gray-600">Blockchain Anchor</p>
          <p className="text-xs font-mono text-gray-900 mt-1 break-all">
            {document.blockchainAnchorTxId}
          </p>
        </div>
      )}

      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            Document integrity protection enabled
          </span>
        </div>
        <button
          onClick={handleVerify}
          disabled={isVerifying}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isVerifying ? 'Verifying...' : 'Verify Document'}
        </button>
      </div>
    </div>
  );
};

export default DocumentVerification;