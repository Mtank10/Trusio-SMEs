import React from 'react';
import { Report } from '../../types';
import { Download, Shield, BarChart3, Calendar } from 'lucide-react';

interface ReportCardProps {
  report: Report;
  onDownload: (reportId: string) => void;
  onVerify: (reportId: string) => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ report, onDownload, onVerify }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Supply Chain Report
              </h3>
              <div className="flex items-center space-x-1 text-sm text-gray-600 mt-1">
                <Calendar className="w-4 h-4" />
                <span>Generated {report.generatedAt.toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onVerify(report.id)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              title="Verify Report"
            >
              <Shield className="w-5 h-5" />
            </button>
            <button
              onClick={() => onDownload(report.id)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              title="Download Report"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-600">Transparency Score</p>
            <p className="text-2xl font-semibold text-blue-600 mt-1">
              {report.transparencyScore}%
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-600">Completion Rate</p>
            <p className="text-2xl font-semibold text-green-600 mt-1">
              {report.supplierCompletionRate}%
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Report ID: {report.id.slice(0, 8)}...
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onVerify(report.id)}
              className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Verify
            </button>
            <button
              onClick={() => onDownload(report.id)}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;