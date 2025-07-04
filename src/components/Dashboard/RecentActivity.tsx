import React from 'react';
import { Clock, CheckCircle, AlertTriangle, Upload } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'response' | 'document' | 'verification' | 'report';
  message: string;
  timestamp: Date;
  status: 'success' | 'warning' | 'info';
}

const RecentActivity: React.FC = () => {
  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'response',
      message: 'Green Materials Co. submitted survey response',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'success',
    },
    {
      id: '2',
      type: 'document',
      message: 'ISO 14001 certificate uploaded by EcoSupply Ltd',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      status: 'info',
    },
    {
      id: '3',
      type: 'verification',
      message: 'Document verification failed for Supplier ABC',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      status: 'warning',
    },
    {
      id: '4',
      type: 'report',
      message: 'Monthly transparency report generated',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      status: 'success',
    },
  ];

  const getIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'response':
        return CheckCircle;
      case 'document':
        return Upload;
      case 'verification':
        return AlertTriangle;
      case 'report':
        return Clock;
      default:
        return Clock;
    }
  };

  const getStatusColor = (status: ActivityItem['status']) => {
    switch (status) {
      case 'success':
        return 'text-sustainability-600';
      case 'warning':
        return 'text-accent-renewable';
      case 'info':
        return 'text-trust-600';
      default:
        return 'text-navy-600';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-navy-200">
      <div className="p-6 border-b border-navy-200">
        <h3 className="text-lg font-medium text-navy-800">Recent Activity</h3>
      </div>
      <div className="p-6">
        <div className="space-y-6">
          {activities.map((activity) => {
            const Icon = getIcon(activity.type);
            return (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`p-1 rounded-full ${getStatusColor(activity.status)}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-navy-800">{activity.message}</p>
                  <p className="text-xs text-navy-500 mt-1">
                    {activity.timestamp.toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;