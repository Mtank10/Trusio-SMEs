import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Protected Pages
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Suppliers from './pages/Suppliers';
import SupplyChain from './pages/SupplyChain';
import Surveys from './pages/Surveys';
import Reports from './pages/Reports';
import Verification from './pages/Verification';
import Billing from './pages/Billing';
import Settings from './pages/Settings';
import SupplierPortal from './pages/SupplierPortal';
import IndiaOnboarding from './pages/IndiaOnboarding';

const AppContent: React.FC = () => {
  const { state: authState } = useAuth();

  if (authState.loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={authState.user ? <Navigate to="/" /> : <Login />} />
      <Route path="/register" element={authState.user ? <Navigate to="/" /> : <Register />} />
      <Route path="/supplier-portal" element={<SupplierPortal />} />
      
      {/* Redirect to onboarding if not completed */}
      <Route path="/india-onboarding" element={
        <ProtectedRoute>
          {authState.onboardingCompleted ? <Navigate to="/" /> : <IndiaOnboarding />}
        </ProtectedRoute>
      } />
      
      {/* Protected Routes - redirect to onboarding if not completed */}
      <Route path="/" element={
        <ProtectedRoute>
          {authState.onboardingCompleted ? <Dashboard /> : <Navigate to="/india-onboarding" />}
        </ProtectedRoute>
      } />
      
      {/* All other protected routes */}
      <Route path="/products" element={
        <ProtectedRoute>
          {authState.onboardingCompleted ? <Products /> : <Navigate to="/india-onboarding" />}
        </ProtectedRoute>
      } />
      <Route path="/suppliers" element={
        <ProtectedRoute>
          {authState.onboardingCompleted ? <Suppliers /> : <Navigate to="/india-onboarding" />}
        </ProtectedRoute>
      } />
      <Route path="/supply-chain" element={
        <ProtectedRoute>
          {authState.onboardingCompleted ? <SupplyChain /> : <Navigate to="/india-onboarding" />}
        </ProtectedRoute>
      } />
      <Route path="/surveys" element={
        <ProtectedRoute>
          {authState.onboardingCompleted ? <Surveys /> : <Navigate to="/india-onboarding" />}
        </ProtectedRoute>
      } />
      <Route path="/reports" element={
        <ProtectedRoute>
          {authState.onboardingCompleted ? <Reports /> : <Navigate to="/india-onboarding" />}
        </ProtectedRoute>
      } />
      <Route path="/verification" element={
        <ProtectedRoute>
          {authState.onboardingCompleted ? <Verification /> : <Navigate to="/india-onboarding" />}
        </ProtectedRoute>
      } />
      <Route path="/billing" element={
        <ProtectedRoute>
          {authState.onboardingCompleted ? <Billing /> : <Navigate to="/india-onboarding" />}
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          {authState.onboardingCompleted ? <Settings /> : <Navigate to="/india-onboarding" />}
        </ProtectedRoute>
      } />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <AppContent />
        </Router>
      </AppProvider>
    </AuthProvider>
  );
};

export default App;