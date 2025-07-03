import React from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Home, 
  Package, 
  Users, 
  FileText, 
  BarChart3, 
  Settings,
  Map,
  Shield
} from 'lucide-react';

interface SidebarItem {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  current: boolean;
}

const Sidebar: React.FC = () => {
  const location = useLocation();

  const navigation: SidebarItem[] = [
    { name: 'Dashboard', icon: Home, href: '/', current: location.pathname === '/' },
    { name: 'Products', icon: Package, href: '/products', current: location.pathname.startsWith('/products') },
    { name: 'Supply Chain', icon: Map, href: '/supply-chain', current: location.pathname.startsWith('/supply-chain') },
    { name: 'Suppliers', icon: Users, href: '/suppliers', current: location.pathname.startsWith('/suppliers') },
    { name: 'Surveys', icon: FileText, href: '/surveys', current: location.pathname.startsWith('/surveys') },
    { name: 'Reports', icon: BarChart3, href: '/reports', current: location.pathname.startsWith('/reports') },
    { name: 'Verification', icon: Shield, href: '/verification', current: location.pathname.startsWith('/verification') },
    { name: 'Settings', icon: Settings, href: '/settings', current: location.pathname.startsWith('/settings') },
  ];

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 bg-gray-50 border-r border-gray-200">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`${
                      item.current
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } group flex items-center px-3 py-2 text-sm font-medium border-l-4 transition-colors`}
                  >
                    <Icon
                      className={`${
                        item.current ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                      } mr-3 h-5 w-5`}
                    />
                    {item.name}
                  </a>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;