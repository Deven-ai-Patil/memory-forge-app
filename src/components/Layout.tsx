
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Plus, Settings, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  const navItems = [
    { label: 'Today', icon: Calendar, path: '/' },
    { label: 'Clients', icon: User, path: '/clients' },
    { label: 'Add', icon: Plus, path: '/add' },
    { label: 'Settings', icon: Settings, path: '/settings' }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1 container mx-auto px-4 py-6 mb-20">
        {children}
      </main>
      
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive 
                    ? "text-blue-600 bg-blue-50" 
                    : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                )}
              >
                <item.icon className="h-5 w-5 mb-1" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
