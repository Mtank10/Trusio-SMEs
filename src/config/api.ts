const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const api = {
  // Auth endpoints
  register: (data: { email: string; password: string; companyName: string }) =>
    fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),

  inviteSupplier: (data: { supplierEmail: string; surveyId: string }, token: string) =>
    fetch(`${API_BASE_URL}/auth/invite-supplier`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }),

  // Products endpoints
  getProducts: (token: string) =>
    fetch(`${API_BASE_URL}/products`, {
      headers: { 'Authorization': `Bearer ${token}` },
    }),

  getProduct: (id: string, token: string) =>
    fetch(`${API_BASE_URL}/products/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    }),

  createProduct: (data: { name: string; description: string }, token: string) =>
    fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }),

  updateProduct: (id: string, data: { name: string; description: string }, token: string) =>
    fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }),

  deleteProduct: (id: string, token: string) =>
    fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    }),

  addSupplier: (productId: string, data: any, token: string) =>
    fetch(`${API_BASE_URL}/products/${productId}/suppliers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }),

  getSupplyChain: (productId: string, token: string) =>
    fetch(`${API_BASE_URL}/products/${productId}/supply-chain`, {
      headers: { 'Authorization': `Bearer ${token}` },
    }),

  // Surveys endpoints
  getSurveys: (token: string) =>
    fetch(`${API_BASE_URL}/surveys`, {
      headers: { 'Authorization': `Bearer ${token}` },
    }),

  createSurvey: (data: any, token: string) =>
    fetch(`${API_BASE_URL}/surveys`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }),

  getSurvey: (surveyId: string, token?: string) =>
    fetch(`${API_BASE_URL}/surveys/${surveyId}${token ? `?token=${token}` : ''}`, {
      headers: token ? {} : { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    }),

  submitSurveyResponse: (surveyId: string, data: any, token: string) =>
    fetch(`${API_BASE_URL}/surveys/${surveyId}/response?token=${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),

  getSurveyResponses: (surveyId: string, token: string) =>
    fetch(`${API_BASE_URL}/surveys/${surveyId}/responses`, {
      headers: { 'Authorization': `Bearer ${token}` },
    }),

  // Documents endpoints
  uploadDocument: (formData: FormData) =>
    fetch(`${API_BASE_URL}/documents/upload`, {
      method: 'POST',
      body: formData,
    }),

  downloadDocument: (documentId: string, token?: string) =>
    fetch(`${API_BASE_URL}/documents/${documentId}${token ? `?token=${token}` : ''}`),

  verifyDocument: (documentId: string) =>
    fetch(`${API_BASE_URL}/documents/${documentId}/verify`, {
      method: 'POST',
    }),

  getDocumentMetadata: (documentId: string) =>
    fetch(`${API_BASE_URL}/documents/${documentId}/metadata`),

  // Reports endpoints
  generateReport: (data: { productId: string }, token: string) =>
    fetch(`${API_BASE_URL}/reports/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }),

  getReports: (token: string) =>
    fetch(`${API_BASE_URL}/reports`, {
      headers: { 'Authorization': `Bearer ${token}` },
    }),

  downloadReport: (reportId: string) =>
    fetch(`${API_BASE_URL}/reports/${reportId}`),

  verifyReport: (reportId: string) =>
    fetch(`${API_BASE_URL}/reports/${reportId}/verify`),

  getReportMetadata: (reportId: string) =>
    fetch(`${API_BASE_URL}/reports/${reportId}/metadata`),

  // User/Settings endpoints
  getUserProfile: (token: string) =>
    fetch(`${API_BASE_URL}/users/profile`, {
      headers: { 'Authorization': `Bearer ${token}` },
    }),

  updateUserProfile: (data: any, token: string) =>
    fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }),

  changePassword: (data: { currentPassword: string; newPassword: string }, token: string) =>
    fetch(`${API_BASE_URL}/users/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }),

  // Billing endpoints
  getSubscription: (token: string) =>
    fetch(`${API_BASE_URL}/billing/subscription`, {
      headers: { 'Authorization': `Bearer ${token}` },
    }),

  updateSubscription: (data: { tierId: string }, token: string) =>
    fetch(`${API_BASE_URL}/billing/subscription`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }),

  getUsage: (token: string) =>
    fetch(`${API_BASE_URL}/billing/usage`, {
      headers: { 'Authorization': `Bearer ${token}` },
    }),

  getInvoices: (token: string) =>
    fetch(`${API_BASE_URL}/billing/invoices`, {
      headers: { 'Authorization': `Bearer ${token}` },
    }),

  getBillingSettings: (token: string) =>
    fetch(`${API_BASE_URL}/billing/settings`, {
      headers: { 'Authorization': `Bearer ${token}` },
    }),

  updateBillingSettings: (data: any, token: string) =>
    fetch(`${API_BASE_URL}/billing/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }),
};