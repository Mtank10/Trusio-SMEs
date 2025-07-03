import React from 'react';
import { useApp } from '../contexts/AppContext';
import Layout from '../components/Layout/Layout';
import SupplyChainMap from '../components/SupplyChain/SupplyChainMap';
import { SupplyChainNode } from '../types';
import { Map } from 'lucide-react';

const SupplyChain: React.FC = () => {
  const { state } = useApp();

  // Mock supply chain data for demonstration
  const mockSupplyChainNodes: SupplyChainNode[] = [
    {
      id: '1',
      name: 'Green Materials Co.',
      tier: 1,
      status: 'verified',
      children: [
        {
          id: '2',
          name: 'EcoSupply Ltd.',
          tier: 2,
          status: 'responded',
          children: [
            {
              id: '3',
              name: 'Raw Materials Inc.',
              tier: 3,
              status: 'pending',
            },
          ],
        },
        {
          id: '4',
          name: 'Sustainable Sources',
          tier: 2,
          status: 'verified',
        },
      ],
    },
    {
      id: '5',
      name: 'Pacific Distributors',
      tier: 1,
      status: 'responded',
      children: [
        {
          id: '6',
          name: 'Regional Logistics',
          tier: 2,
          status: 'pending',
        },
      ],
    },
  ];

  const handleNodeClick = (node: SupplyChainNode) => {
    console.log('Node clicked:', node);
    // In real app, would show detailed supplier information
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Supply Chain</h1>
          <p className="text-gray-600">
            Visualize and manage your supply chain network
          </p>
        </div>

        {state.products.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Map className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No supply chain data</h3>
            <p className="text-gray-600 mb-4">
              Add products and suppliers to visualize your supply chain
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {state.products.map((product) => (
              <div key={product.id} className="space-y-4">
                <div className="border-b border-gray-200 pb-2">
                  <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.description}</p>
                </div>
                <SupplyChainMap
                  nodes={mockSupplyChainNodes}
                  onNodeClick={handleNodeClick}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SupplyChain;