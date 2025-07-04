import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../config/api';
import Layout from '../components/Layout/Layout';
import PricingCard from '../components/Billing/PricingCard';
import UsageChart from '../components/Billing/UsageChart';
import InvoiceTable from '../components/Billing/InvoiceTable';
import PaymentMethodForm from '../components/Billing/PaymentMethodForm';
import UpgradeModal from '../components/Billing/UpgradeModal';
import { SUBSCRIPTION_TIERS } from '../config/subscriptions';
import { SubscriptionTier, Subscription, Usage, Invoice } from '../types/billing';
import { CreditCard, Download, AlertCircle, Plus } from 'lucide-react';

const Billing: React.FC = () => {
  const { state: authState } = useAuth();
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [usageData, setUsageData] = useState<Usage[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBillingData();
  }, [authState.token]);

  const fetchBillingData = async () => {
    if (!authState.token) return;

    try {
      setLoading(true);
      setError(null);

      const [subscriptionRes, usageRes, invoicesRes] = await Promise.all([
        api.getSubscription(authState.token),
        api.getUsage(authState.token),
        api.getInvoices(authState.token),
      ]);

      if (subscriptionRes.ok) {
        const subscription = await subscriptionRes.json();
        setCurrentSubscription(subscription);
      }

      if (usageRes.ok) {
        const usage = await usageRes.json();
        setUsageData(usage);
      }

      if (invoicesRes.ok) {
        const invoicesData = await invoicesRes.json();
        setInvoices(invoicesData);
      }
    } catch (error) {
      console.error('Error fetching billing data:', error);
      setError('Failed to load billing data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (tierId: string) => {
    const targetTier = SUBSCRIPTION_TIERS.find(tier => tier.id === tierId);
    if (!targetTier) return;

    if (tierId === 'enterprise') {
      // Redirect to contact sales
      window.open('mailto:sales@trusio.com?subject=Enterprise Plan Inquiry', '_blank');
      return;
    }

    const currentTier = SUBSCRIPTION_TIERS.find(tier => tier.id === currentSubscription?.tierId);
    if (currentTier) {
      setSelectedTier(targetTier);
      setShowUpgradeModal(true);
    } else {
      // Direct upgrade
      await performUpgrade(tierId);
    }
  };

  const performUpgrade = async (tierId: string) => {
    if (!authState.token) return;

    setUpgradeLoading(true);
    try {
      const response = await api.updateSubscription({ tierId }, authState.token);
      if (!response.ok) throw new Error('Failed to upgrade subscription');

      await fetchBillingData(); // Refresh data
      setShowUpgradeModal(false);
      alert('Subscription upgraded successfully!');
    } catch (error) {
      console.error('Error upgrading subscription:', error);
      alert('Failed to upgrade subscription');
    } finally {
      setUpgradeLoading(false);
    }
  };

  const handleSavePaymentMethod = async (paymentMethod: any) => {
    try {
      // In real app, would save payment method via Stripe
      console.log('Saving payment method:', paymentMethod);
      setShowPaymentForm(false);
      alert('Payment method saved successfully!');
    } catch (error) {
      console.error('Error saving payment method:', error);
      alert('Failed to save payment method');
    }
  };

  const currentTier = SUBSCRIPTION_TIERS.find(tier => tier.id === currentSubscription?.tierId);
  const chartData = usageData.map(usage => ({
    month: usage.period,
    apiCalls: usage.apiCalls,
    documentsVerified: usage.documentsVerified,
    hashesAnchored: usage.hashesAnchored,
  }));

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-navy-600">Loading billing information...</div>
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
              onClick={fetchBillingData}
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
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-navy-800">Billing & Subscription</h1>
          <p className="text-navy-600">
            Manage your subscription, view usage, and download invoices
          </p>
        </div>

        {/* Current Plan Overview */}
        {currentSubscription && currentTier && (
          <div className="bg-white rounded-xl shadow-sm border border-navy-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-navy-800">Current Plan</h3>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-2xl font-bold text-trust-600">{currentTier.name}</span>
                  <span className="px-3 py-1 bg-sustainability-100 text-sustainability-700 rounded-full text-sm font-medium">
                    {currentSubscription.status}
                  </span>
                </div>
                <p className="text-sm text-navy-600 mt-1">
                  Next billing date: {new Date(currentSubscription.currentPeriodEnd).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-navy-800">
                  ${currentTier.price}/{currentTier.interval}
                </div>
                <button 
                  onClick={() => setShowPaymentForm(true)}
                  className="mt-2 flex items-center space-x-2 px-4 py-2 bg-navy-100 text-navy-700 rounded-lg hover:bg-navy-200 transition-colors"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Update Payment Method</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Usage Overview */}
        {usageData.length > 0 && (
          <UsageChart 
            data={chartData}
            limits={{
              apiCalls: currentTier?.features.apiCalls || 0,
            }}
          />
        )}

        {/* Subscription Plans */}
        <div>
          <h3 className="text-lg font-medium text-navy-800 mb-6">Available Plans</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SUBSCRIPTION_TIERS.map((tier) => (
              <PricingCard
                key={tier.id}
                tier={tier}
                currentTier={currentSubscription?.tierId}
                onSelect={handleUpgrade}
                isLoading={upgradeLoading}
              />
            ))}
          </div>
        </div>

        {/* Transaction Fees Info */}
        <div className="bg-trust-50 rounded-xl border border-trust-200 p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-trust-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-trust-800">Transaction-Based Fees</h4>
              <div className="mt-2 space-y-1 text-sm text-trust-700">
                <p>• Document Verification: $0.50 - $2.00 per document</p>
                <p>• API Calls: $0.01 per call beyond plan limits</p>
                <p>• Blockchain Anchoring: $0.10 per hash anchored</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Invoices */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-navy-800">Recent Invoices</h3>
            <button className="flex items-center space-x-2 px-4 py-2 bg-trust-600 text-white rounded-lg hover:bg-trust-700 transition-colors">
              <Download className="w-4 h-4" />
              <span>Download All</span>
            </button>
          </div>
          <InvoiceTable invoices={invoices} />
        </div>

        {/* Modals */}
        {showPaymentForm && (
          <PaymentMethodForm
            onSave={handleSavePaymentMethod}
            onCancel={() => setShowPaymentForm(false)}
          />
        )}

        {showUpgradeModal && selectedTier && currentTier && (
          <UpgradeModal
            currentTier={currentTier}
            targetTier={selectedTier}
            onConfirm={() => performUpgrade(selectedTier.id)}
            onCancel={() => setShowUpgradeModal(false)}
            isLoading={upgradeLoading}
          />
        )}
      </div>
    </Layout>
  );
};

export default Billing;