import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../config/api';
import Layout from '../components/Layout/Layout';
import ReportCard from '../components/Reports/ReportCard';
import { Report, Product } from '../types';
import { BarChart3, Download, Plus } from 'lucide-react';

const Reports: React.FC = () => {
  const { state: authState } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [authState.token]);

  const fetchData = async () => {
    if (!authState.token) return;

    try {
      setLoading(true);
      setError(null);

      const [reportsRes, productsRes] = await Promise.all([
        api.getReports(authState.token),
        api.getProducts(authState.token),
      ]);

      if (!reportsRes.ok || !productsRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const reportsData = await reportsRes.json();
      const productsData = await productsRes.json();

      setReports(reportsData);
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!authState.token || products.length === 0) {
      alert('Please add a product first before generating reports');
      return;
    }

    try {
      setGenerating(true);
      
      // For now, generate report for the first product
      const response = await api.generateReport({
        productId: products[0].id,
      }, authState.token);

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      const result = await response.json();
      console.log('Report generated:', result);
      
      await fetchData(); // Refresh the list
      alert('Report generated successfully!');
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadReport = async (reportId: string) => {
    try {
      const response = await api.downloadReport(reportId);
      if (!response.ok) throw new Error('Failed to download report');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `supply-chain-report-${reportId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Failed to download report');
    }
  };

  const handleVerifyReport = async (reportId: string) => {
    try {
      const response = await api.verifyReport(reportId);
      if (!response.ok) throw new Error('Failed to verify report');

      const verification = await response.json();
      console.log('Report verification:', verification);
      
      // Show verification details in a modal or new page
      alert(`Report verified! Transparency Score: ${verification.transparencyScore}%`);
    } catch (error) {
      console.error('Error verifying report:', error);
      alert('Failed to verify report');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-navy-600">Loading reports...</div>
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
            <h1 className="text-2xl font-bold text-navy-800">Reports</h1>
            <p className="text-navy-600">
              Generate and download supply chain transparency reports
            </p>
          </div>
          <button
            onClick={handleGenerateReport}
            disabled={generating || products.length === 0}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-trust-600 to-energy-600 text-white rounded-lg hover:from-trust-700 hover:to-energy-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-trust"
          >
            {generating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Generate Report</span>
              </>
            )}
          </button>
        </div>

        {reports.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-navy-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-navy-400" />
            </div>
            <h3 className="text-lg font-medium text-navy-800 mb-2">No reports yet</h3>
            <p className="text-navy-600 mb-4">
              Generate your first transparency report to share with stakeholders
            </p>
            <button
              onClick={handleGenerateReport}
              disabled={products.length === 0}
              className="px-4 py-2 bg-gradient-to-r from-trust-600 to-energy-600 text-white rounded-lg hover:from-trust-700 hover:to-energy-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {products.length === 0 ? 'Add a Product First' : 'Generate Your First Report'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
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