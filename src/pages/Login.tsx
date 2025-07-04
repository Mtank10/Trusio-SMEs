import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Building2, Shield, Loader2 } from 'lucide-react';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const { state, login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (error) {
      // Error is handled by the auth context
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-50 via-trust-50 to-energy-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-trust-600 to-energy-600 rounded-xl flex items-center justify-center shadow-trust">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-trust-600 to-energy-600 bg-clip-text text-transparent">
              Trusio
            </span>
          </div>
          <h2 className="text-3xl font-bold text-navy-800">Welcome back</h2>
          <p className="mt-2 text-navy-600">
            Sign in to your supply chain transparency platform
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-trust border border-navy-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {state.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="text-red-600 text-sm">{state.error}</div>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-navy-700 mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-navy-300 rounded-lg focus:ring-2 focus:ring-trust-500 focus:border-trust-500 transition-colors"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-navy-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-12 border border-navy-300 rounded-lg focus:ring-2 focus:ring-trust-500 focus:border-trust-500 transition-colors"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-navy-400 hover:text-navy-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-trust-600 focus:ring-trust-500 border-navy-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-navy-700">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-trust-600 hover:text-trust-500">
                  Forgot your password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={state.loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-trust-600 to-energy-600 hover:from-trust-700 hover:to-energy-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-trust-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {state.loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-navy-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-navy-500">New to Trusio?</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/register"
                className="font-medium text-trust-600 hover:text-trust-500"
              >
                Create your account
              </Link>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="text-center">
          <div className="flex items-center justify-center text-sm text-navy-500">
            <Shield className="w-4 h-4 mr-1" />
            <span>Your data is protected with enterprise-grade security</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;