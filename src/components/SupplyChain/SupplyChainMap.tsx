import React from 'react';
import { SupplyChainNode } from '../../types';
import { Building, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface SupplyChainMapProps {
  nodes: SupplyChainNode[];
  onNodeClick: (node: SupplyChainNode) => void;
}

const SupplyChainMap: React.FC<SupplyChainMapProps> = ({ nodes, onNodeClick }) => {
  const getStatusIcon = (status: SupplyChainNode['status']) => {
    switch (status) {
      case 'verified':
        return CheckCircle;
      case 'responded':
        return CheckCircle;
      case 'pending':
        return Clock;
      default:
        return AlertTriangle;
    }
  };

  const getStatusColor = (status: SupplyChainNode['status']) => {
    switch (status) {
      case 'verified':
        return 'border-green-500 bg-green-50';
      case 'responded':
        return 'border-blue-500 bg-blue-50';
      case 'pending':
        return 'border-yellow-500 bg-yellow-50';
      default:
        return 'border-gray-500 bg-gray-50';
    }
  };

  const renderNode = (node: SupplyChainNode, level: number = 0) => {
    const StatusIcon = getStatusIcon(node.status);
    const statusColor = getStatusColor(node.status);

    return (
      <div key={node.id} className="flex flex-col items-center">
        <div
          className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${statusColor}`}
          onClick={() => onNodeClick(node)}
          style={{ marginLeft: level * 40 }}
        >
          <div className="flex items-center space-x-3">
            <Building className="w-5 h-5 text-gray-600" />
            <div>
              <h4 className="font-medium text-gray-900">{node.name}</h4>
              <p className="text-sm text-gray-600">Tier {node.tier}</p>
            </div>
            <StatusIcon className="w-4 h-4 text-gray-500" />
          </div>
        </div>
        
        {node.children && node.children.length > 0 && (
          <div className="mt-4 space-y-4">
            {node.children.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Supply Chain Map</h3>
      <div className="space-y-6">
        {nodes.map((node) => renderNode(node))}
      </div>
    </div>
  );
};

export default SupplyChainMap;