import React from 'react';
import { Supplier } from '../../types';
import { Building, Mail, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

interface SupplierCardProps {
  supplier: Supplier;
  onInvite: (supplierId: string) => void;
  onViewResponse: (supplierId: string) => void;
}

const SupplierCard: React.FC<SupplierCardProps> = ({
  supplier,
  onInvite,
  onViewResponse,
}) => {
  const getStatusIcon = (status: Supplier['status']) => {
    switch (status) {
      case 'responded':
        return CheckCircle;
      case 'verified':
        return CheckCircle;
      case 'pending':
        return Clock;
      default:
        return AlertTriangle;
    }
  };

  const getStatusColor = (status: Supplier['status']) => {
    switch (status) {
      case 'responded':
        return 'text-blue-600 bg-blue-50';
      case 'verified':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const StatusIcon = getStatusIcon(supplier.status);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-gray-50 rounded-lg">
              <Building className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">{supplier.name}</h3>
              <div className="flex items-center space-x-1 text-sm text-gray-600 mt-1">
                <Mail className="w-4 h-4" />
                <span>{supplier.email}</span>
              </div>
            </div>
          </div>
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(supplier.status)}`}>
            <StatusIcon className="w-3 h-3" />
            <span className="capitalize">{supplier.status}</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Tier {supplier.tier}</span>
            {supplier.responseDate && (
              <span className="text-sm text-gray-600">
                Responded {supplier.responseDate.toLocaleDateString()}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {supplier.status === 'pending' && (
              <button
                onClick={() => onInvite(supplier.id)}
                className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Resend Invite
              </button>
            )}
            {supplier.status === 'responded' && (
              <button
                onClick={() => onViewResponse(supplier.id)}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                View Response
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierCard;