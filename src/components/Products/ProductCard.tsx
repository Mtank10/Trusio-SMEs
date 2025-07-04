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
    <div className="bg-white rounded-xl shadow-sm border border-navy-200 hover:shadow-trust transition-all">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-trust-50 rounded-lg">
              <Package className="w-5 h-5 text-trust-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-navy-800">{product.name}</h3>
              <p className="text-sm text-navy-600 mt-1">{product.description}</p>
            </div>
          </div>
          <div className="relative">
            <button className="p-2 text-navy-400 hover:text-navy-600 hover:bg-navy-50 rounded-full transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-sm text-navy-600">
              <Users className="w-4 h-4" />
              <span>0 suppliers</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-navy-600">
              <FileText className="w-4 h-4" />
              <span>0 responses</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onViewSuppliers(product.id)}
              className="px-3 py-1 text-sm text-trust-600 hover:text-trust-700 font-medium"
            >
              View Chain
            </button>
            <button
              onClick={() => onEdit(product)}
              className="px-3 py-1 text-sm bg-gradient-to-r from-trust-600 to-energy-600 text-white rounded-md hover:from-trust-700 hover:to-energy-700 transition-all"
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