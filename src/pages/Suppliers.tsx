import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import Layout from '../components/Layout/Layout';
import SupplierCard from '../components/Suppliers/SupplierCard';
import SupplierForm from '../components/Suppliers/SupplierForm';
import { Supplier } from '../types';
import { Plus, Users } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const Suppliers: React.FC = () => {
  const { state, dispatch } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | undefined>();
  const [selectedProductId, setSelectedProductId] = useState<string>('');

  const handleAddSupplier = () => {
    if (state.products.length === 0) {
      alert('Please add a product first before adding suppliers');
      return;
    }
    setEditingSupplier(undefined);
    setSelectedProductId(state.products[0].id);
    setShowForm(true);
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setSelectedProductId(supplier.productId);
    setShowForm(true);
  };

  const handleSaveSupplier = (supplierData: Partial<Supplier>) => {
    if (editingSupplier) {
      // Update existing supplier
      const updatedSupplier = { ...editingSupplier, ...supplierData };
      dispatch({ type: 'UPDATE_SUPPLIER', payload: updatedSupplier });
    } else {
      // Add new supplier
      const newSupplier: Supplier = {
        id: uuidv4(),
        name: supplierData.name!,
        email: supplierData.email!,
        tier: supplierData.tier!,
        productId: selectedProductId,
        status: 'pending',
      };
      dispatch({ type: 'ADD_SUPPLIER', payload: newSupplier });
    }
    setShowForm(false);
  };

  const handleInviteSupplier = (supplierId: string) => {
    // Simulate sending invitation
    console.log('Inviting supplier:', supplierId);
    // In real app, would send email with unique survey link
  };

  const handleViewResponse = (supplierId: string) => {
    // Navigate to supplier response view
    console.log('Viewing response for supplier:', supplierId);
  };

  const getProductName = (productId: string) => {
    const product = state.products.find(p => p.id === productId);
    return product?.name || 'Unknown Product';
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Suppliers</h1>
            <p className="text-gray-600">
              Manage your supply chain partners and their data submissions
            </p>
          </div>
          <button
            onClick={handleAddSupplier}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Supplier</span>
          </button>
        </div>

        {state.suppliers.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No suppliers yet</h3>
            <p className="text-gray-600 mb-4">
              Start building your supply chain by adding suppliers
            </p>
            <button
              onClick={handleAddSupplier}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Your First Supplier
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {state.products.map((product) => {
              const productSuppliers = state.suppliers.filter(s => s.productId === product.id);
              if (productSuppliers.length === 0) return null;

              return (
                <div key={product.id} className="space-y-4">
                  <div className="border-b border-gray-200 pb-2">
                    <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-600">{productSuppliers.length} suppliers</p>
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