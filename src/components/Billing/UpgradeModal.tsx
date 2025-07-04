import React, { useState } from 'react';
import { SubscriptionTier } from '../../types/billing';
import { X, Check, CreditCard, Zap } from 'lucide-react';

interface UpgradeModalProps {
  currentTier: SubscriptionTier;
  targetTier: SubscriptionTier;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({
  currentTier,
  targetTier,
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  const [prorationAccepted, setProrationAccepted] = useState(false);
  
  const priceDifference = targetTier.price - currentTier.price;
  const prorationAmount = Math.round((priceDifference * 0.7) * 100) / 100; // Approximate proration

  const upgrades = [
    {
      feature: 'Products',
      current: currentTier.features.products,
      new: targetTier.features.products,
    },
    {
      feature: 'Suppliers',
      current: currentTier.features.suppliers,
      new: targetTier.features.suppliers,
    },
    {
      feature: 'API Calls',
      current: currentTier.features.apiCalls,
      new: targetTier.features.apiCalls,
    },
  ];

  const newFeatures = [];
  if (targetTier.features.blockchainAnchoring && !currentTier.features.blockchainAnchoring) {
    newFeatures.push('Blockchain Anchoring');
  }
  if (targetTier.features.customReports && !currentTier.features.customReports) {
    newFeatures.push('Custom Reports');
  }
  if (targetTier.features.sso && !currentTier.features.sso) {
    newFeatures.push('SSO Integration');
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-trust">
        <div className="flex items-center justify-between p-6 border-b border-navy-200">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-trust-600" />
            <h3 className="text-lg font-medium text-navy-800">
              Upgrade to {targetTier.name}
            </h3>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-navy-400 hover:text-navy-600 hover:bg-navy-50 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Plan Comparison */}
          <div>
            <h4 className="font-medium text-navy-800 mb-3">What's changing</h4>
            <div className="space-y-2">
              {upgrades.map((upgrade) => (
                <div key={upgrade.feature} className="flex items-center justify-between py-2 border-b border-navy-100">
                  <span className="text-sm text-navy-600">{upgrade.feature}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-navy-500">
                      {upgrade.current === 'unlimited' ? '∞' : upgrade.current}
                    </span>
                    <span className="text-navy-400">→</span>
                    <span className="text-sm font-medium text-trust-600">
                      {upgrade.new === 'unlimited' ? '∞' : upgrade.new}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* New Features */}
          {newFeatures.length > 0 && (
            <div>
              <h4 className="font-medium text-navy-800 mb-3">New features you'll get</h4>
              <div className="space-y-2">
                {newFeatures.map((feature) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-sustainability-600" />
                    <span className="text-sm text-navy-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pricing */}
          <div className="bg-trust-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-trust-700">New monthly price</span>
              <span className="font-medium text-trust-800">${targetTier.price}/month</span>
            </div>
            {priceDifference > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-trust-700">Prorated charge today</span>
                <span className="font-medium text-trust-800">${prorationAmount}</span>
              </div>
            )}
          </div>

          {/* Proration Agreement */}
          {priceDifference > 0 && (
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="proration"
                checked={prorationAccepted}
                onChange={(e) => setProrationAccepted(e.target.checked)}
                className="mt-1 h-4 w-4 text-trust-600 focus:ring-trust-500 border-navy-300 rounded"
              />
              <label htmlFor="proration" className="text-sm text-navy-700">
                I understand that I'll be charged ${prorationAmount} today for the remainder of this billing period, 
                and ${targetTier.price} on my next billing date.
              </label>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-navy-700 bg-white border border-navy-300 rounded-lg hover:bg-navy-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading || (priceDifference > 0 && !prorationAccepted)}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-trust-600 to-energy-600 rounded-lg hover:from-trust-700 hover:to-energy-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CreditCard className="w-4 h-4" />
              <span>
                {isLoading ? 'Processing...' : `Upgrade to ${targetTier.name}`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;