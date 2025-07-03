import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import Layout from '../components/Layout/Layout';
import ProductCard from '../components/Products/ProductCard';
import ProductForm from '../components/Products/ProductForm';
import { Product } from '../types';
import { Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const Products: React.FC = () => {
  const { state, dispatch } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();

  const handleAddProduct = () => {
    setEditingProduct(undefined);
    setShowForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleSaveProduct = (productData: Partial<Product>) => {
    if (editingProduct) {
      // Update existing product
      const updatedProduct = { ...editingProduct, ...productData };
      dispatch({ type: 'SET_PRODUCTS', payload: state.products.map(p => p.id === editingProduct.id ? updatedProduct : p) });
    } else {
      // Add new product
      const newProduct: Product = {
        id: uuidv4(),
        name: productData.name!,
        description: productData.description!,
        smeId: state.user?.id || '',
        createdAt: new Date(),
      };
      dispatch({ type: 'ADD_PRODUCT', payload: newProduct });
    }
    setShowForm(false);
  };

  const handleDeleteProduct = (productId: string) => {
    dispatch({ type: 'SET_PRODUCTS', payload: state.products.filter(p => p.id !== productId) });
  };

  const handleViewSuppliers = (productId: string) => {
    // Navigate to supply chain view for this product
    console.log('View suppliers for product:', productId);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600">
              Manage your products and their supply chain requirements
            </p>
          </div>
          <button
            onClick={handleAddProduct}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>

        {state.products.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
            <p className="text-gray-600 mb-4">
              Start by adding your first product to track its supply chain
            </p>
            <button
              onClick={handleAddProduct}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Your First Product
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {state.products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
                onViewSuppliers={handleViewSuppliers}
              />
            ))}
          </div>
        )}

        {showForm && (
          <ProductForm
            product={editingProduct}
            onSave={handleSaveProduct}
            onCancel={() => setShowForm(false)}
          />
        )}
      </div>
    </Layout>
  );
};

export default Products;