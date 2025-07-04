import { SubscriptionTier } from '../types/billing';

export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'seed',
    name: 'Seed',
    price: 0,
    interval: 'month',
    features: {
      products: 1,
      suppliers: 3,
      apiCalls: 100,
      blockchainAnchoring: false,
      customReports: false,
      sso: false,
      dedicatedInstance: false,
      sla: false,
    },
  },
  {
    id: 'grow',
    name: 'Grow',
    price: 79,
    interval: 'month',
    features: {
      products: 5,
      suppliers: 20,
      apiCalls: 1000,
      blockchainAnchoring: false,
      customReports: false,
      sso: false,
      dedicatedInstance: false,
      sla: false,
    },
    popular: true,
  },
  {
    id: 'scale',
    name: 'Scale',
    price: 399,
    interval: 'month',
    features: {
      products: 'unlimited',
      suppliers: 'unlimited',
      apiCalls: 10000,
      blockchainAnchoring: true,
      customReports: true,
      sso: false,
      dedicatedInstance: false,
      sla: false,
    },
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 0, // Custom pricing
    interval: 'month',
    features: {
      products: 'unlimited',
      suppliers: 'unlimited',
      apiCalls: 'unlimited',
      blockchainAnchoring: true,
      customReports: true,
      sso: true,
      dedicatedInstance: true,
      sla: true,
    },
  },
];

export const TRANSACTION_FEES = {
  documentVerification: {
    basic: 0.50,
    premium: 2.00,
  },
  apiCall: 0.01,
  blockchainAnchoring: 0.10,
};

export const VALUE_ADD_SERVICES = {
  premiumVerification: {
    conflictMinerals: 99,
    carbonFootprint: 149,
    laborCompliance: 199,
  },
  customApiFeeds: {
    retailerIntegration: 5000, // per year
    erpIntegration: 3000, // per year
  },
  training: {
    perUser: 50,
    groupSession: 500,
  },
  whiteLabel: {
    revenueShare: 0.15, // 15%
  },
  enterpriseSolutions: {
    retailerCompliance: 10000, // per year
    customBlockchain: {
      setup: 25000,
      monthly: 2000,
    },
    supplyChainRiskAI: 0.10, // per supplier
  },
};