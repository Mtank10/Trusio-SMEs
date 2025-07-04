import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../config/api';
import Layout from '../components/Layout/Layout';
import StatsCard from '../components/Dashboard/StatsCard';
import RecentActivity from '../components/Dashboard/RecentActivity';
import TransparencyChart from '../components/Dashboard/TransparencyChart';
import { Package, Users, FileText, BarChart3 } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { state: authState } = useAuth();
  const [stats, setStats] = useState({
    products: 0,
    suppliers: 0,
    responses: 0,
    transparencyScore: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!authState.token) return;

      try {
        const [productsRes, surveysRes] = await Promise.all([
          api.getProducts(authState.token),
          api.getSurveys(authState.token),
        ]);

        const products = await productsRes.json();
        const surveys = await surveysRes.json();

        // Calculate stats from API data
        const totalSuppliers = products.reduce((acc: number, product: any) => 
          acc + (product.suppliers?.length || 0), 0);
        
        const totalResponses = surveys.reduce((acc: number, survey: any) => 
          acc + (survey.responses?.length || 0), 0);

        setStats({
          products: products.length,
          suppliers: totalSuppliers,
          responses: totalResponses,
          transparencyScore: 87, // This would be calculated based on actual data
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [authState.token]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-navy-600">Loading dashboard...</div>
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
            trend={{ value: 12, label: 'from last month' }}
            color="trust"
          />
          <StatsCard
            title="Active Suppliers"
            value={stats.suppliers}
            icon={Users}
            trend={{ value: 8, label: 'from last month' }}
            color="sustainability"
          />
          <StatsCard
            title="Survey Responses"
            value={stats.responses}
            icon={FileText}
            trend={{ value: 23, label: 'from last week' }}
            color="energy"
          />
          <StatsCard
            title="Transparency Score"
            value={`${stats.transparencyScore}%`}
            icon={BarChart3}
            trend={{ value: 5, label: 'from last month' }}
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