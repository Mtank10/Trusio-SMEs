import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Home, 
  Package, 
  Users, 
  FileText, 
  BarChart3, 
  Settings,
  Map,
  Shield,
  CreditCard,
  Building2,
  Award
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
    { name: 'GST Compliance', icon: Building2, href: '/gst-compliance', current: location.pathname.startsWith('/gst-compliance') },
    { name: 'MSME Benefits', icon: Award, href: '/msme-benefits', current: location.pathname.startsWith('/msme-benefits') },
    { name: 'Billing', icon: CreditCard, href: '/billing', current: location.pathname.startsWith('/billing') },
    { name: 'Settings', icon: Settings, href: '/settings', current: location.pathname.startsWith('/settings') },
  ];

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 bg-navy-50 border-r border-navy-200">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      item.current
                        ? 'bg-trust-50 border-trust-500 text-trust-700'
                        : 'border-transparent text-navy-600 hover:bg-navy-100 hover:text-navy-800'
                    } group flex items-center px-3 py-2 text-sm font-medium border-l-4 transition-colors`}
                  >
                    <Icon
                      className={`${
                        item.current ? 'text-trust-500' : 'text-navy-400 group-hover:text-navy-500'
                      } mr-3 h-5 w-5`}
                    />
                    {item.name}
                  </Link>
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