import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Building2, Shield, Loader2, Check } from 'lucide-react';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { state, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return;
    }

    try {
      await register(formData.email, formData.password, formData.companyName);
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

  const passwordsMatch = formData.password === formData.confirmPassword;
  const isPasswordValid = formData.password.length >= 8;

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
          <h2 className="text-3xl font-bold text-navy-800">Create your account</h2>
          <p className="mt-2 text-navy-600">
            Start building transparency in your supply chain
          </p>
        </div>

        {/* Registration Form */}
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
              <label htmlFor="companyName" className="block text-sm font-medium text-navy-700 mb-2">
                Company Name
              </label>
              <input
                id="companyName"
                name="companyName"
                type="text"
                required
                value={formData.companyName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-navy-300 rounded-lg focus:ring-2 focus:ring-trust-500 focus:border-trust-500 transition-colors"
                placeholder="Enter your company name"
              />
            </div>

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
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-12 border border-navy-300 rounded-lg focus:ring-2 focus:ring-trust-500 focus:border-trust-500 transition-colors"
                  placeholder="Create a password"
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
              {formData.password && (
                <div className="mt-2 flex items-center text-sm">
                  {isPasswordValid ? (
                    <Check className="w-4 h-4 text-sustainability-500 mr-1" />
                  ) : (
                    <div className="w-4 h-4 border border-navy-300 rounded-full mr-1" />
                  )}
                  <span className={isPasswordValid ? 'text-sustainability-600' : 'text-navy-500'}>
                    At least 8 characters
                  </span>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-navy-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-12 border border-navy-300 rounded-lg focus:ring-2 focus:ring-trust-500 focus:border-trust-500 transition-colors"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-navy-400 hover:text-navy-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {formData.confirmPassword && (
                <div className="mt-2 flex items-center text-sm">
                  {passwordsMatch ? (
                    <Check className="w-4 h-4 text-sustainability-500 mr-1" />
                  ) : (
                    <div className="w-4 h-4 border border-navy-300 rounded-full mr-1" />
                  )}
                  <span className={passwordsMatch ? 'text-sustainability-600' : 'text-navy-500'}>
                    Passwords match
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center">
              <input
                id="agree-terms"
                name="agree-terms"
                type="checkbox"
                required
                className="h-4 w-4 text-trust-600 focus:ring-trust-500 border-navy-300 rounded"
              />
              <label htmlFor="agree-terms" className="ml-2 block text-sm text-navy-700">
                I agree to the{' '}
                <a href="#" className="text-trust-600 hover:text-trust-500">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-trust-600 hover:text-trust-500">
                  Privacy Policy
                </a>
              </label>
            </div>

            <button
              type="submit"
              disabled={state.loading || !passwordsMatch || !isPasswordValid}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-trust-600 to-energy-600 hover:from-trust-700 hover:to-energy-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-trust-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {state.loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-navy-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-navy-500">Already have an account?</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="font-medium text-trust-600 hover:text-trust-500"
              >
                Sign in to your account
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

export default Register;