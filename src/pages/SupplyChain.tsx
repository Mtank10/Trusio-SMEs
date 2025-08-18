import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../config/api';
import Layout from '../components/Layout/Layout';
import SupplyChainMap from '../components/SupplyChain/SupplyChainMap';
import { SupplyChainNode, Product } from '../types';
import { Map, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SupplyChain: React.FC = () => {
  const { state: authState } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [supplyChainData, setSupplyChainData] = useState<Record<string, SupplyChainNode[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [authState.token]);

  const fetchData = async () => {
    if (!authState.token) return;

    try {
      setLoading(true);
      setError(null);

      const productsRes = await api.getProducts(authState.token);
      if (!productsRes.ok) throw new Error('Failed to fetch products');

      const productsData = await productsRes.json();
      setProducts(productsData);

      // Build supply chain data from products
      const supplyChainMap: Record<string, SupplyChainNode[]> = {};
      
      productsData.forEach((product: Product) => {
        if (product.suppliers && product.suppliers.length > 0) {
          const nodes = convertSuppliersToNodes(product.suppliers);
          supplyChainMap[product.id] = nodes;
        } else {
          supplyChainMap[product.id] = [];
        }
      });

      setSupplyChainData(supplyChainMap);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load supply chain data');
    } finally {
      setLoading(false);
    }
  };

  const handleNodeClick = (node: SupplyChainNode) => {
    console.log('Node clicked:', node);
    // In real app, would show detailed supplier information
  };

  const convertSuppliersToNodes = (suppliers: any[]): SupplyChainNode[] => {
    // Convert flat supplier list to hierarchical nodes
    const nodeMap = new Map<string, SupplyChainNode>();
    
    // Create nodes for all suppliers
    suppliers.forEach(supplier => {
      nodeMap.set(supplier.id, {
        id: supplier.id,
        name: supplier.name,
        tier: supplier.tier,
        status: supplier.status,
        children: [],
      });
    });

    // Build hierarchy
    const rootNodes: SupplyChainNode[] = [];
    suppliers.forEach(supplier => {
      const node = nodeMap.get(supplier.id)!;
      if (supplier.parentSupplierId) {
        const parent = nodeMap.get(supplier.parentSupplierId);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(node);
        }
      } else {
        rootNodes.push(node);
      }
    });

    return rootNodes;
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-navy-600">Loading supply chain data...</div>
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
              onClick={fetchData}
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-navy-800">Supply Chain</h1>
            <p className="text-navy-600">
              Visualize and manage your supply chain network
            </p>
          </div>
          {products.length > 0 && (
            <button
              onClick={() => navigate('/suppliers')}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-trust-600 to-energy-600 text-white rounded-lg hover:from-trust-700 hover:to-energy-700 transition-all shadow-trust"
            >
              <Plus className="w-4 h-4" />
              <span>Add Suppliers</span>
            </button>
          )}
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-navy-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Map className="w-8 h-8 text-navy-400" />
            </div>
            <h3 className="text-lg font-medium text-navy-800 mb-2">No products found</h3>
            <p className="text-navy-600 mb-4">
              Add products first to start building your supply chain
            </p>
            <button
              onClick={() => navigate('/products')}
              className="px-4 py-2 bg-gradient-to-r from-trust-600 to-energy-600 text-white rounded-lg hover:from-trust-700 hover:to-energy-700 transition-all"
            >
              Add Your First Product
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {products.map((product) => {
              const suppliers = product.suppliers || [];
              const nodes = supplyChainData[product.id] || [];
              
              return (
                <div key={product.id} className="space-y-4">
                  <div className="border-b border-navy-200 pb-2">
                    <h3 className="text-lg font-medium text-navy-800">{product.name}</h3>
                    <p className="text-sm text-navy-600">{product.description}</p>
                    <p className="text-sm text-navy-500 mt-1">
                      {suppliers.length} suppliers
                      {suppliers.length > 0 && ` across ${Math.max(...suppliers.map(s => s.tier), 0)} tiers`}
                    </p>
                  </div>
                  
                  {nodes.length > 0 ? (
                    <SupplyChainMap
                      nodes={nodes}
                      onNodeClick={handleNodeClick}
                    />
                  ) : (
                    <div className="text-center py-8 bg-navy-50 rounded-lg">
                      <p className="text-navy-600 mb-4">No suppliers added for this product yet</p>
                      <button
                        onClick={() => navigate('/suppliers')}
                        className="px-4 py-2 bg-trust-600 text-white rounded-lg hover:bg-trust-700 transition-colors"
                      >
                        Add Suppliers
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SupplyChain;