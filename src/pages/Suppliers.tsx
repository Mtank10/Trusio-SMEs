import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../config/api';
import Layout from '../components/Layout/Layout';
import SupplierCard from '../components/Suppliers/SupplierCard';
import SupplierForm from '../components/Suppliers/SupplierForm';
import { Supplier, Product } from '../types';
import { Plus, Users } from 'lucide-react';

const Suppliers: React.FC = () => {
  const { state: authState } = useAuth();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | undefined>();
  const [selectedProductId, setSelectedProductId] = useState<string>('');
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

      // Extract suppliers from products
      const allSuppliers = productsData.reduce((acc: Supplier[], product: any) => {
        if (product.suppliers) {
          return [...acc, ...product.suppliers];
        }
        return acc;
      }, []);
      
      setSuppliers(allSuppliers);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load suppliers');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSupplier = () => {
    if (products.length === 0) {
      alert('Please add a product first before adding suppliers');
      return;
    }
    setEditingSupplier(undefined);
    setSelectedProductId(products[0].id);
    setShowForm(true);
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setSelectedProductId(supplier.productId);
    setShowForm(true);
  };

  const handleSaveSupplier = async (supplierData: Partial<Supplier>) => {
    if (!authState.token) return;

    try {
      if (editingSupplier) {
        // Update existing supplier - would need API endpoint
        console.log('Update supplier:', editingSupplier.id, supplierData);
      } else {
        // Add new supplier
        const response = await api.addSupplier(selectedProductId, supplierData, authState.token);
        if (!response.ok) throw new Error('Failed to add supplier');
      }
      
      await fetchData(); // Refresh the list
      setShowForm(false);
    } catch (error) {
      console.error('Error saving supplier:', error);
      alert('Failed to save supplier');
    }
  };

  const handleInviteSupplier = async (supplierId: string) => {
    if (!authState.token) return;

    try {
      // Find a survey for this supplier's product
      const supplier = suppliers.find(s => s.id === supplierId);
      if (!supplier) return;

      // For now, just log - would need to create survey first
      console.log('Inviting supplier:', supplierId);
      alert('Supplier invitation feature requires creating a survey first');
    } catch (error) {
      console.error('Error inviting supplier:', error);
    }
  };

  const handleViewResponse = (supplierId: string) => {
    // Navigate to supplier response view
    console.log('Viewing response for supplier:', supplierId);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-navy-600">Loading suppliers...</div>
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
            <h1 className="text-2xl font-bold text-navy-800">Suppliers</h1>
            <p className="text-navy-600">
              Manage your supply chain partners and their data submissions
            </p>
          </div>
          <button
            onClick={handleAddSupplier}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-trust-600 to-energy-600 text-white rounded-lg hover:from-trust-700 hover:to-energy-700 transition-all shadow-trust"
          >
            <Plus className="w-4 h-4" />
            <span>Add Supplier</span>
          </button>
        </div>

        {suppliers.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-navy-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-navy-400" />
            </div>
            <h3 className="text-lg font-medium text-navy-800 mb-2">No suppliers yet</h3>
            <p className="text-navy-600 mb-4">
              Start building your supply chain by adding suppliers
            </p>
            <button
              onClick={handleAddSupplier}
              className="px-4 py-2 bg-gradient-to-r from-trust-600 to-energy-600 text-white rounded-lg hover:from-trust-700 hover:to-energy-700 transition-all"
            >
              Add Your First Supplier
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((product) => {
              const productSuppliers = suppliers.filter(s => s.productId === product.id);
              if (productSuppliers.length === 0) return null;

              return (
                <div key={product.id} className="space-y-4">
                  <div className="border-b border-navy-200 pb-2">
                    <h3 className="text-lg font-medium text-navy-800">{product.name}</h3>
                    <p className="text-sm text-navy-600">{productSuppliers.length} suppliers</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {productSuppliers.map((supplier) => (
                      <SupplierCard
                        key={supplier.id}
                        supplier={supplier}
                        onInvite={handleInviteSupplier}
                        onViewResponse={handleViewResponse}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {showForm && (
          <SupplierForm
            supplier={editingSupplier}
            productId={selectedProductId}
            onSave={handleSaveSupplier}
            onCancel={() => setShowForm(false)}
          />
        )}
      </div>
    </Layout>
  );
};

export default Suppliers;