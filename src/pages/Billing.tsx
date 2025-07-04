import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout/Layout';
import PricingCard from '../components/Billing/PricingCard';
import UsageChart from '../components/Billing/UsageChart';
import InvoiceTable from '../components/Billing/InvoiceTable';
import { SUBSCRIPTION_TIERS } from '../config/subscriptions';
import { SubscriptionTier, Subscription, Usage, Invoice } from '../types/billing';
import { CreditCard, Download, AlertCircle } from 'lucide-react';

const Billing: React.FC = () => {
  const { state: authState } = useAuth();
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [usageData, setUsageData] = useState<Usage[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [upgradeLoading, setUpgradeLoading] = useState(false);

  useEffect(() => {
    fetchBillingData();
  }, [authState.token]);

  const fetchBillingData = async () => {
    if (!authState.token) return;

    try {
      // Mock data for demonstration
      setCurrentSubscription({
        id: '1',
        userId: authState.user?.id || '',
        tierId: 'grow',
        status: 'active',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        cancelAtPeriodEnd: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      setUsageData([
        {
          id: '1',
          userId: authState.user?.id || '',
          subscriptionId: '1',
          period: '2024-01',
          apiCalls: 450,
          documentsVerified: 23,
          hashesAnchored: 0,
          createdAt: new Date(),
        },
        {
          id: '2',
          userId: authState.user?.id || '',
          subscriptionId: '1',
          period: '2024-02',
          apiCalls: 680,
          documentsVerified: 31,
          hashesAnchored: 0,
          createdAt: new Date(),
        },
        {
          id: '3',
          userId: authState.user?.id || '',
          subscriptionId: '1',
          period: '2024-03',
          apiCalls: 820,
          documentsVerified: 45,
          hashesAnchored: 0,
          createdAt: new Date(),
        },
      ]);

      setInvoices([
        {
          id: '1',
          userId: authState.user?.id || '',
          subscriptionId: '1',
          amount: 79.00,
          currency: 'USD',
          status: 'paid',
          dueDate: new Date(),
          paidAt: new Date(),
          lineItems: [
            {
              id: '1',
              description: 'Grow Plan - Monthly',
              quantity: 1,
              unitPrice: 79.00,
              amount: 79.00,
              type: 'subscription',
            },
          ],
          createdAt: new Date(),
        },
      ]);
    } catch (error) {
      console.error('Error fetching billing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (tierId: string) => {
    setUpgradeLoading(true);
    try {
      // In real app, would integrate with Stripe
      console.log('Upgrading to tier:', tierId);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update current subscription
      if (currentSubscription) {
        setCurrentSubscription({
          ...currentSubscription,
          tierId,
        });
      }
    } catch (error) {
      console.error('Error upgrading subscription:', error);
    } finally {
      setUpgradeLoading(false);
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
                  Next billing date: {currentSubscription.currentPeriodEnd.toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-navy-800">
                  ${currentTier.price}/{currentTier.interval}
                </div>
                <button className="mt-2 flex items-center space-x-2 px-4 py-2 bg-navy-100 text-navy-700 rounded-lg hover:bg-navy-200 transition-colors">
                  <CreditCard className="w-4 h-4" />
                  <span>Update Payment Method</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Usage Overview */}
        <UsageChart 
          data={chartData}
          limits={{
            apiCalls: currentTier?.features.apiCalls || 0,
          }}
        />

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
      </div>
    </Layout>
  );
};

export default Billing;