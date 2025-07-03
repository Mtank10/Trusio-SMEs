export interface User {
  id: string;
  email: string;
  companyName: string;
  role: 'sme_admin' | 'supplier';
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  smeId: string;
  createdAt: Date;
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  tier: number;
  parentSupplierId?: string;
  productId: string;
  status: 'pending' | 'responded' | 'verified';
  responseDate?: Date;
}

export interface Survey {
  id: string;
  productId: string;
  supplierTier: number;
  questions: SurveyQuestion[];
  createdBy: string;
  createdAt: Date;
}

export interface SurveyQuestion {
  id: string;
  type: 'text' | 'select' | 'multiselect' | 'file' | 'date' | 'number';
  question: string;
  options?: string[];
  required: boolean;
  category: 'general' | 'environmental' | 'social' | 'governance';
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  supplierEmail: string;
  answers: Record<string, any>;
  documents: Document[];
  status: 'pending' | 'submitted';
  token: string;
  submittedAt?: Date;
}

export interface Document {
  id: string;
  surveyResponseId: string;
  originalFilename: string;
  storagePath: string;
  hashSha256: string;
  timestamp: Date;
  blockchainAnchorTxId?: string;
  verified: boolean;
  fileSize: number;
  mimeType: string;
}

export interface Report {
  id: string;
  productId: string;
  generatedAt: Date;
  pdfUrl: string;
  verificationUrl: string;
  transparencyScore: number;
  supplierCompletionRate: number;
}

export interface SupplyChainNode {
  id: string;
  name: string;
  tier: number;
  status: 'pending' | 'responded' | 'verified';
  children?: SupplyChainNode[];
  x?: number;
  y?: number;
}