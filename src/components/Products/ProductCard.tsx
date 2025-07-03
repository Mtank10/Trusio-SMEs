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
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Package className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-slate-900">{product.name}</h3>
              <p className="text-sm text-slate-600 mt-1">{product.description}</p>
            </div>
          </div>
          <div className="relative">
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-sm text-slate-600">
              <Users className="w-4 h-4" />
              <span>0 suppliers</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-slate-600">
              <FileText className="w-4 h-4" />
              <span>0 responses</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onViewSuppliers(product.id)}
              className="px-3 py-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View Chain
            </button>
            <button
              onClick={() => onEdit(product)}
              className="px-3 py-1 text-sm bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md hover:from-indigo-700 hover:to-purple-700 transition-all"
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