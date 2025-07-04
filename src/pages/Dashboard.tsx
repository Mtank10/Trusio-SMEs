import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../config/api';
import Layout from '../components/Layout/Layout';
import StatsCard from '../components/Dashboard/StatsCard';
import RecentActivity from '../components/Dashboard/RecentActivity';
import TransparencyChart from '../components/Dashboard/TransparencyChart';
import { Package, Users, FileText, BarChart3 } from 'lucide-react';

interface DashboardStats {
  products: number;
  suppliers: number;
  responses: number;
  transparencyScore: number;
  trends: {
    products: number;
    suppliers: number;
    responses: number;
    transparencyScore: number;
  };
}

const Dashboard: React.FC = () => {
  const { state: authState } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    products: 0,
    suppliers: 0,
    responses: 0,
    transparencyScore: 0,
    trends: {
      products: 0,
      suppliers: 0,
      responses: 0,
      transparencyScore: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, [authState.token]);

  const fetchDashboardData = async () => {
    if (!authState.token) return;

    try {
      setLoading(true);
      setError(null);

      const [productsRes, surveysRes] = await Promise.all([
        api.getProducts(authState.token),
        api.getSurveys(authState.token),
      ]);

      if (!productsRes.ok || !surveysRes.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const products = await productsRes.json();
      const surveys = await surveysRes.json();

      // Calculate stats from API data
      const totalSuppliers = products.reduce((acc: number, product: any) => 
        acc + (product.suppliers?.length || 0), 0);
      
      const totalResponses = surveys.reduce((acc: number, survey: any) => 
        acc + (survey.responses?.length || 0), 0);

      // Calculate transparency score based on completion rates
      const completedResponses = surveys.reduce((acc: number, survey: any) => 
        acc + (survey.responses?.filter((r: any) => r.status === 'SUBMITTED').length || 0), 0);
      
      const transparencyScore = totalResponses > 0 
        ? Math.round((completedResponses / totalResponses) * 100)
        : 0;

      setStats({
        products: products.length,
        suppliers: totalSuppliers,
        responses: totalResponses,
        transparencyScore,
        trends: {
          products: 12, // These would come from historical data
          suppliers: 8,
          responses: 23,
          transparencyScore: 5,
        },
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-navy-600">Loading dashboard...</div>
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
              onClick={fetchDashboardData}
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
          <h1 className="text-2xl font-bold text-navy-800">Dashboard</h1>
          <p className="text-navy-600">
            Overview of your supply chain transparency activities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Products"
            value={stats.products}
            icon={Package}
            trend={{ value: stats.trends.products, label: 'from last month' }}
            color="trust"
          />
          <StatsCard
            title="Active Suppliers"
            value={stats.suppliers}
            icon={Users}
            trend={{ value: stats.trends.suppliers, label: 'from last month' }}
            color="sustainability"
          />
          <StatsCard
            title="Survey Responses"
            value={stats.responses}
            icon={FileText}
            trend={{ value: stats.trends.responses, label: 'from last week' }}
            color="energy"
          />
          <StatsCard
            title="Transparency Score"
            value={`${stats.transparencyScore}%`}
            icon={BarChart3}
            trend={{ value: stats.trends.transparencyScore, label: 'from last month' }}
            color="sustainability"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TransparencyChart />
          </div>
          <div>
            <RecentActivity />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;