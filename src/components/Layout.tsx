import { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ShoppingCart, Package, Home, LogOut, User, FileText } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  cartItemCount?: number;
}

export function Layout({ children, currentPage, onNavigate, cartItemCount = 0 }: LayoutProps) {
  const { user, signOut } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'cart', label: 'Cart', icon: ShoppingCart, badge: cartItemCount },
    { id: 'complex-form', label: 'Form', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="hidden md:flex md:flex-col w-64 bg-white border-r border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">E2E Test Shop</h1>
        </div>

        <nav data-testid="sidebar-nav" className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                data-testid={`nav-${item.id}`}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  currentPage === item.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    data-testid="cart-badge"
                    className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full"
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="bg-blue-100 p-2 rounded-full">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p data-testid="user-name" className="font-medium text-gray-800 truncate">
                {user?.full_name || 'User'}
              </p>
              <p data-testid="user-role" className="text-sm text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            data-testid="logout-button"
            onClick={signOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-6 py-4 md:hidden">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-800">E2E Test Shop</h1>
            <button
              data-testid="mobile-cart"
              onClick={() => onNavigate('cart')}
              className="relative p-2"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
