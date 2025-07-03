import React from 'react';
import { useApp } from '../contexts/AppContext';
import Layout from '../components/Layout/Layout';
import StatsCard from '../components/Dashboard/StatsCard';
import RecentActivity from '../components/Dashboard/RecentActivity';
import TransparencyChart from '../components/Dashboard/TransparencyChart';
import { Package, Users, FileText, BarChart3 } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { state } = useApp();

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Overview of your supply chain transparency activities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Products"
            value={state.products.length}
            icon={Package}
            trend={{ value: 12, label: 'from last month' }}
            color="blue"
          />
          <StatsCard
            title="Active Suppliers"
            value={state.suppliers.length}
            icon={Users}
            trend={{ value: 8, label: 'from last month' }}
            color="green"
          />
          <StatsCard
            title="Survey Responses"
            value={state.responses.length}
            icon={FileText}
            trend={{ value: 23, label: 'from last week' }}
            color="yellow"
          />
          <StatsCard
            title="Transparency Score"
            value="87%"
            icon={BarChart3}
            trend={{ value: 5, label: 'from last month' }}
            color="green"
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