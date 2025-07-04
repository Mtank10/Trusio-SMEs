import React, { useState } from 'react';
import { CreditCard, Lock, X } from 'lucide-react';

interface PaymentMethodFormProps {
  onSave: (paymentMethod: any) => void;
  onCancel: () => void;
}

const PaymentMethodForm: React.FC<PaymentMethodFormProps> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvc: '',
    name: '',
    address: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'US',
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, would use Stripe Elements
    onSave(formData);
  };

  const handleChange = (field: string, value: string) => {
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1];
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [addressField]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [field]: value,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-trust">
        <div className="flex items-center justify-between p-6 border-b border-navy-200">
          <div className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-trust-600" />
            <h3 className="text-lg font-medium text-navy-800">Add Payment Method</h3>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-navy-400 hover:text-navy-600 hover:bg-navy-50 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-2">
              Card Number
            </label>
            <input
              type="text"
              value={formData.cardNumber}
              onChange={(e) => handleChange('cardNumber', e.target.value)}
              placeholder="1234 5678 9012 3456"
              className="w-full px-4 py-3 border border-navy-300 rounded-lg focus:ring-2 focus:ring-trust-500 focus:border-trust-500"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-2">
                Month
              </label>
              <select
                value={formData.expiryMonth}
                onChange={(e) => handleChange('expiryMonth', e.target.value)}
                className="w-full px-3 py-3 border border-navy-300 rounded-lg focus:ring-2 focus:ring-trust-500 focus:border-trust-500"
                required
              >
                <option value="">MM</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                    {String(i + 1).padStart(2, '0')}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-2">
                Year
              </label>
              <select
                value={formData.expiryYear}
                onChange={(e) => handleChange('expiryYear', e.target.value)}
                className="w-full px-3 py-3 border border-navy-300 rounded-lg focus:ring-2 focus:ring-trust-500 focus:border-trust-500"
                required
              >
                <option value="">YY</option>
                {Array.from({ length: 10 }, (_, i) => {
                  const year = new Date().getFullYear() + i;
                  return (
                    <option key={year} value={String(year).slice(-2)}>
                      {String(year).slice(-2)}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-2">
                CVC
              </label>
              <input
                type="text"
                value={formData.cvc}
                onChange={(e) => handleChange('cvc', e.target.value)}
                placeholder="123"
                maxLength={4}
                className="w-full px-3 py-3 border border-navy-300 rounded-lg focus:ring-2 focus:ring-trust-500 focus:border-trust-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-navy-700 mb-2">
              Cardholder Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-3 border border-navy-300 rounded-lg focus:ring-2 focus:ring-trust-500 focus:border-trust-500"
              required
            />
          </div>

          <div className="border-t border-navy-200 pt-4">
            <h4 className="text-sm font-medium text-navy-700 mb-3">Billing Address</h4>
            
            <div className="space-y-3">
              <input
                type="text"
                value={formData.address.line1}
                onChange={(e) => handleChange('address.line1', e.target.value)}
                placeholder="Address line 1"
                className="w-full px-4 py-3 border border-navy-300 rounded-lg focus:ring-2 focus:ring-trust-500 focus:border-trust-500"
                required
              />
              
              <input
                type="text"
                value={formData.address.line2}
                onChange={(e) => handleChange('address.line2', e.target.value)}
                placeholder="Address line 2 (optional)"
                className="w-full px-4 py-3 border border-navy-300 rounded-lg focus:ring-2 focus:ring-trust-500 focus:border-trust-500"
              />
              
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={formData.address.city}
                  onChange={(e) => handleChange('address.city', e.target.value)}
                  placeholder="City"
                  className="w-full px-4 py-3 border border-navy-300 rounded-lg focus:ring-2 focus:ring-trust-500 focus:border-trust-500"
                  required
                />
                <input
                  type="text"
                  value={formData.address.state}
                  onChange={(e) => handleChange('address.state', e.target.value)}
                  placeholder="State"
                  className="w-full px-4 py-3 border border-navy-300 rounded-lg focus:ring-2 focus:ring-trust-500 focus:border-trust-500"
                  required
                />
              </div>
              
              <input
                type="text"
                value={formData.address.postalCode}
                onChange={(e) => handleChange('address.postalCode', e.target.value)}
                placeholder="ZIP / Postal Code"
                className="w-full px-4 py-3 border border-navy-300 rounded-lg focus:ring-2 focus:ring-trust-500 focus:border-trust-500"
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 text-sm text-navy-600 bg-navy-50 p-3 rounded-lg">
            <Lock className="w-4 h-4" />
            <span>Your payment information is encrypted and secure</span>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-navy-700 bg-white border border-navy-300 rounded-lg hover:bg-navy-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-trust-600 to-energy-600 rounded-lg hover:from-trust-700 hover:to-energy-700"
            >
              Save Payment Method
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentMethodForm;