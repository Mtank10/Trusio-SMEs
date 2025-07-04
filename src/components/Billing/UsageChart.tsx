import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface UsageData {
  month: string;
  apiCalls: number;
  documentsVerified: number;
  hashesAnchored: number;
}

interface UsageChartProps {
  data: UsageData[];
  limits: {
    apiCalls: number | 'unlimited';
    documentsVerified?: number;
    hashesAnchored?: number;
  };
}

const UsageChart: React.FC<UsageChartProps> = ({ data, limits }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-navy-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-navy-800">Usage Overview</h3>
        <p className="text-sm text-navy-600 mt-1">Track your monthly usage across all services</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-trust-50 rounded-lg p-4">
          <div className="text-sm text-trust-600 font-medium">API Calls</div>
          <div className="text-2xl font-bold text-trust-700 mt-1">
            {data[data.length - 1]?.apiCalls.toLocaleString() || 0}
          </div>
          <div className="text-xs text-trust-600 mt-1">
            of {limits.apiCalls === 'unlimited' ? '∞' : limits.apiCalls.toLocaleString()} limit
          </div>
        </div>

        <div className="bg-sustainability-50 rounded-lg p-4">
          <div className="text-sm text-sustainability-600 font-medium">Documents Verified</div>
          <div className="text-2xl font-bold text-sustainability-700 mt-1">
            {data[data.length - 1]?.documentsVerified.toLocaleString() || 0}
          </div>
          <div className="text-xs text-sustainability-600 mt-1">
            this month
          </div>
        </div>

        <div className="bg-energy-50 rounded-lg p-4">
          <div className="text-sm text-energy-600 font-medium">Blockchain Anchors</div>
          <div className="text-2xl font-bold text-energy-700 mt-1">
            {data[data.length - 1]?.hashesAnchored.toLocaleString() || 0}
          </div>
          <div className="text-xs text-energy-600 mt-1">
            this month
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="month" stroke="#64748b" />
          <YAxis stroke="#64748b" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }} 
          />
          <Legend />
          <Bar dataKey="apiCalls" fill="#2563eb" name="API Calls" radius={[2, 2, 0, 0]} />
          <Bar dataKey="documentsVerified" fill="#10b981" name="Documents Verified" radius={[2, 2, 0, 0]} />
          <Bar dataKey="hashesAnchored" fill="#06b6d4" name="Blockchain Anchors" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UsageChart;