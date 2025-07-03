import React from 'react';
import { useApp } from '../contexts/AppContext';
import Layout from '../components/Layout/Layout';
import ReportCard from '../components/Reports/ReportCard';
import { Report } from '../types';
import { BarChart3, Download } from 'lucide-react';

const Reports: React.FC = () => {
  const { state } = useApp();

  // Mock reports data for demonstration
  const mockReports: Report[] = [
    {
      id: '1',
      productId: '1',
      generatedAt: new Date(),
      pdfUrl: '/reports/report-1.pdf',
      verificationUrl: '/verify/report-1',
      transparencyScore: 87,
      supplierCompletionRate: 92,
    },
    {
      id: '2',
      productId: '1',
      generatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      pdfUrl: '/reports/report-2.pdf',
      verificationUrl: '/verify/report-2',
      transparencyScore: 82,
      supplierCompletionRate: 88,
    },
  ];

  const handleDownloadReport = (reportId: string) => {
    // In real app, would download the actual PDF
    console.log('Downloading report:', reportId);
  };

  const handleVerifyReport = (reportId: string) => {
    // In real app, would show verification details
    console.log('Verifying report:', reportId);
  };

  const handleGenerateReport = () => {
    // In real app, would generate a new report
    console.log('Generating new report');
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
            <p className="text-gray-600">
              Generate and download supply chain transparency reports
            </p>
          </div>
          <button
            onClick={handleGenerateReport}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Generate Report</span>
          </button>
        </div>

        {mockReports.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reports yet</h3>
            <p className="text-gray-600 mb-4">
              Generate your first transparency report to share with stakeholders
            </p>
            <button
              onClick={handleGenerateReport}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Generate Your First Report
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockReports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                onDownload={handleDownloadReport}
                onVerify={handleVerifyReport}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Reports;