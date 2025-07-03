import React from 'react';
import { Product } from '../../types';
import { Package, Users, FileText, MoreHorizontal } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onViewSuppliers: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onDelete,
  onViewSuppliers,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{product.description}</p>
            </div>
          </div>
          <div className="relative">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span>12 suppliers</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <FileText className="w-4 h-4" />
              <span>8 responses</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onViewSuppliers(product.id)}
              className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View Chain
            </button>
            <button
              onClick={() => onEdit(product)}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Manage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;