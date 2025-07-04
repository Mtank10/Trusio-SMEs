import React from 'react';
import { SubscriptionTier } from '../../types/billing';
import { Check, Star } from 'lucide-react';

interface PricingCardProps {
  tier: SubscriptionTier;
  currentTier?: string;
  onSelect: (tierId: string) => void;
  isLoading?: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({
  tier,
  currentTier,
  onSelect,
  isLoading = false,
}) => {
  const isCurrentTier = currentTier === tier.id;
  const isEnterprise = tier.id === 'enterprise';

  const formatFeatureValue = (value: number | string) => {
    if (value === 'unlimited') return 'Unlimited';
    if (typeof value === 'number') return value.toLocaleString();
    return value;
  };

  return (
    <div className={`relative bg-white rounded-2xl shadow-sm border-2 transition-all hover:shadow-trust ${
      tier.popular ? 'border-trust-500' : 'border-navy-200'
    } ${isCurrentTier ? 'ring-2 ring-sustainability-500' : ''}`}>
      {tier.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-trust-600 to-energy-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
            <Star className="w-3 h-3" />
            <span>Most Popular</span>
          </div>
        </div>
      )}

      <div className="p-8">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-navy-800">{tier.name}</h3>
          <div className="mt-4">
            {isEnterprise ? (
              <div className="text-3xl font-bold text-navy-800">Custom</div>
            ) : (
              <>
                <span className="text-4xl font-bold text-navy-800">${tier.price}</span>
                <span className="text-navy-600">/{tier.interval}</span>
              </>
            )}
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-navy-600">Products</span>
            <span className="text-sm font-medium text-navy-800">
              {formatFeatureValue(tier.features.products)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-navy-600">Suppliers</span>
            <span className="text-sm font-medium text-navy-800">
              {formatFeatureValue(tier.features.suppliers)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-navy-600">API Calls</span>
            <span className="text-sm font-medium text-navy-800">
              {formatFeatureValue(tier.features.apiCalls)}/month
            </span>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {tier.features.blockchainAnchoring && (
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-sustainability-600" />
              <span className="text-sm text-navy-700">Blockchain Anchoring</span>
            </div>
          )}
          {tier.features.customReports && (
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-sustainability-600" />
              <span className="text-sm text-navy-700">Custom Reports</span>
            </div>
          )}
          {tier.features.sso && (
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-sustainability-600" />
              <span className="text-sm text-navy-700">SSO Integration</span>
            </div>
          )}
          {tier.features.dedicatedInstance && (
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-sustainability-600" />
              <span className="text-sm text-navy-700">Dedicated Instance</span>
            </div>
          )}
          {tier.features.sla && (
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-sustainability-600" />
              <span className="text-sm text-navy-700">SLA Guarantee</span>
            </div>
          )}
        </div>

        <div className="mt-8">
          <button
            onClick={() => onSelect(tier.id)}
            disabled={isLoading || isCurrentTier}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
              isCurrentTier
                ? 'bg-sustainability-100 text-sustainability-700 cursor-not-allowed'
                : tier.popular
                ? 'bg-gradient-to-r from-trust-600 to-energy-600 text-white hover:from-trust-700 hover:to-energy-700 shadow-trust'
                : 'bg-navy-100 text-navy-700 hover:bg-navy-200'
            }`}
          >
            {isLoading ? (
              'Processing...'
            ) : isCurrentTier ? (
              'Current Plan'
            ) : isEnterprise ? (
              'Contact Sales'
            ) : (
              `Upgrade to ${tier.name}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingCard;