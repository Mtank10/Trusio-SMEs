import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, Settings, Bell, User, MapPin } from 'lucide-react';
import LanguageSelector from '../India/LanguageSelector';

const Header: React.FC = () => {
  const { state, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white shadow-sm border-b border-navy-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-trust-600 to-energy-600 rounded-lg flex items-center justify-center shadow-trust">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="ml-2 text-xl font-semibold bg-gradient-to-r from-trust-600 to-energy-600 bg-clip-text text-transparent">
                Trusio
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-navy-400 hover:text-navy-600 hover:bg-navy-50 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-trust-100 to-energy-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-trust-600" />
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-medium text-navy-800">
                  {state.user?.companyName || 'Company Name'}
                </div>
                <div className="text-xs text-navy-500">
                  {state.user?.email || 'user@example.com'}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button className="p-2 text-navy-400 hover:text-navy-600 hover:bg-navy-50 rounded-full transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <button 
                onClick={handleLogout}
                className="p-2 text-navy-400 hover:text-navy-600 hover:bg-navy-50 rounded-full transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
              <span>Trusio India</span>
            </div>
            <div className="ml-2 flex items-center space-x-1 px-2 py-1 bg-trust-50 rounded-full">
              <MapPin className="w-3 h-3 text-trust-600" />
              <span className="text-xs text-trust-700 font-medium">भारत</span>
            </div>
          </div>
        </div>
      </div>
      <LanguageSelector />
    </header>
  );
};

          

export default Header;