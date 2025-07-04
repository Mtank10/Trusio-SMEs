import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../config/api';
import Layout from '../components/Layout/Layout';
import SupplyChainMap from '../components/SupplyChain/SupplyChainMap';
import { SupplyChainNode, Product } from '../types';
import { Map } from 'lucide-react';

const SupplyChain: React.FC = () => {
  const { state: authState } = useAuth();
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

      // Fetch supply chain data for each product
      const supplyChainPromises = productsData.map(async (product: Product) => {
        try {
          const response = await api.getSupplyChain(product.id, authState.token!);
          if (response.ok) {
            const data = await response.json();
            return { productId: product.id, data };
          }
        } catch (error) {
          console.error(`Error fetching supply chain for product ${product.id}:`, error);
        }
        return { productId: product.id, data: [] };
      });

      const supplyChainResults = await Promise.all(supplyChainPromises);
      const supplyChainMap = supplyChainResults.reduce((acc, result) => {
        acc[result.productId] = result.data;
        return acc;
      }, {} as Record<string, SupplyChainNode[]>);

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
        <div>
          <h1 className="text-2xl font-bold text-navy-800">Supply Chain</h1>
          <p className="text-navy-600">
            Visualize and manage your supply chain network
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-navy-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Map className="w-8 h-8 text-navy-400" />
            </div>
            <h3 className="text-lg font-medium text-navy-800 mb-2">No supply chain data</h3>
            <p className="text-navy-600 mb-4">
              Add products and suppliers to visualize your supply chain
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {products.map((product) => {
              const suppliers = product.suppliers || [];
              const nodes = convertSuppliersToNodes(suppliers);
              
              return (
                <div key={product.id} className="space-y-4">
                  <div className="border-b border-navy-200 pb-2">
                    <h3 className="text-lg font-medium text-navy-800">{product.name}</h3>
                    <p className="text-sm text-navy-600">{product.description}</p>
                    <p className="text-sm text-navy-500 mt-1">
                      {suppliers.length} suppliers across {Math.max(...suppliers.map(s => s.tier), 0)} tiers
                    </p>
                  </div>
                  
                  {nodes.length > 0 ? (
                    <SupplyChainMap
                      nodes={nodes}
                      onNodeClick={handleNodeClick}
                    />
                  ) : (
                    <div className="text-center py-8 bg-navy-50 rounded-lg">
                      <p className="text-navy-600">No suppliers added for this product yet</p>
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