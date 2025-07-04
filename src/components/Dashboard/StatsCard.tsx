import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  color?: 'trust' | 'sustainability' | 'energy' | 'navy' | 'accent';
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  color = 'trust' 
}) => {
  const colorClasses = {
    trust: 'bg-trust-50 text-trust-600',
    sustainability: 'bg-sustainability-50 text-sustainability-600',
    energy: 'bg-energy-50 text-energy-600',
    navy: 'bg-navy-50 text-navy-600',
    accent: 'bg-accent-coffee/10 text-accent-coffee',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-navy-200 p-6 hover:shadow-trust transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-navy-600">{title}</p>
          <p className="text-2xl font-semibold text-navy-800 mt-1">{value}</p>
          {trend && (
            <p className="text-xs text-navy-500 mt-1">
              <span className={`${trend.value >= 0 ? 'text-sustainability-600' : 'text-red-600'}`}>
                {trend.value >= 0 ? '+' : ''}{trend.value}%
              </span>{' '}
              {trend.label}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;