export interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: {
    products: number | 'unlimited';
    suppliers: number | 'unlimited';
    apiCalls: number | 'unlimited';
    blockchainAnchoring: boolean;
    customReports: boolean;
    sso: boolean;
    dedicatedInstance: boolean;
    sla: boolean;
  };
  popular?: boolean;
}

export interface Subscription {
  id: string;
  userId: string;
  tierId: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  stripeSubscriptionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Usage {
  id: string;
  userId: string;
  subscriptionId: string;
  period: string; // YYYY-MM format
  apiCalls: number;
  documentsVerified: number;
  hashesAnchored: number;
  createdAt: Date;
}

export interface Invoice {
  id: string;
  userId: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';
  dueDate: Date;
  paidAt?: Date;
  stripeInvoiceId?: string;
  lineItems: InvoiceLineItem[];
  createdAt: Date;
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  type: 'subscription' | 'verification' | 'api' | 'blockchain' | 'service';
}

export interface BillingSettings {
  id: string;
  userId: string;
  companyName: string;
  email: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  taxId?: string;
  paymentMethodId?: string;
  createdAt: Date;
  updatedAt: Date;
}