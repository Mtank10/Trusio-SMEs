import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TransparencyChart: React.FC = () => {
  const data = [
    { name: 'Jan', score: 65 },
    { name: 'Feb', score: 72 },
    { name: 'Mar', score: 78 },
    { name: 'Apr', score: 85 },
    { name: 'May', score: 88 },
    { name: 'Jun', score: 92 },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Transparency Score Trend</h3>
        <p className="text-sm text-gray-600 mt-1">Monthly supply chain transparency improvements</p>
      </div>
      <div className="p-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="score" fill="#2563eb" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TransparencyChart;