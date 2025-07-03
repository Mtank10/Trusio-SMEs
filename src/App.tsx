import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider, useApp } from './contexts/AppContext';
import { User, Product, Supplier } from './types';
import { v4 as uuidv4 } from 'uuid';

// Pages
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Suppliers from './pages/Suppliers';
import SupplyChain from './pages/SupplyChain';
import Surveys from './pages/Surveys';
import Reports from './pages/Reports';
import Verification from './pages/Verification';
import SupplierPortal from './pages/SupplierPortal';

// Mock data initialization
const AppInitializer: React.FC = () => {
  const { dispatch } = useApp();

  useEffect(() => {
    // Initialize mock user
    const mockUser: User = {
      id: uuidv4(),
      email: 'admin@example.com',
      companyName: 'EcoTech Solutions',
      role: 'sme_admin',
      createdAt: new Date(),
    };

    // Initialize mock products
    const mockProducts: Product[] = [
      {
        id: uuidv4(),
        name: 'Sustainable Smartphone',
        description: 'Eco-friendly smartphone with recycled materials',
        smeId: mockUser.id,
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Green Laptop',
        description: 'Energy-efficient laptop with sustainable packaging',
        smeId: mockUser.id,
        createdAt: new Date(),
      },
    ];

    // Initialize mock suppliers
    const mockSuppliers: Supplier[] = [
      {
        id: uuidv4(),
        name: 'Green Materials Co.',
        email: 'contact@greenmaterials.com',
        tier: 1,
        productId: mockProducts[0].id,
        status: 'verified',
        responseDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        id: uuidv4(),
        name: 'EcoSupply Ltd.',
        email: 'info@ecosupply.com',
        tier: 2,
        productId: mockProducts[0].id,
        status: 'responded',
        responseDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        id: uuidv4(),
        name: 'Sustainable Sources',
        email: 'contact@sustainablesources.com',
        tier: 1,
        productId: mockProducts[1].id,
        status: 'pending',
      },
    ];

    // Initialize state
    dispatch({ type: 'SET_USER', payload: mockUser });
    dispatch({ type: 'SET_PRODUCTS', payload: mockProducts });
    dispatch({ type: 'SET_SUPPLIERS', payload: mockSuppliers });
  }, [dispatch]);

  return null;
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <AppInitializer />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/supply-chain" element={<SupplyChain />} />
          <Route path="/surveys" element={<Surveys />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/verification" element={<Verification />} />
          <Route path="/supplier-portal" element={<SupplierPortal />} />
        </Routes>
      </Router>
    </AppProvider>
  );
};

export default App;