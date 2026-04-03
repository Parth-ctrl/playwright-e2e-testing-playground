import { useAuth } from '../contexts/AuthContext';
import { Package, ShoppingCart, TrendingUp, Award } from 'lucide-react';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { user } = useAuth();

  const stats = [
    { id: 'products', label: 'Products', value: '12', icon: Package, color: 'bg-blue-500' },
    { id: 'orders', label: 'Orders', value: '0', icon: ShoppingCart, color: 'bg-green-500' },
    { id: 'revenue', label: 'Revenue', value: '$0', icon: TrendingUp, color: 'bg-purple-500' },
    { id: 'points', label: 'Points', value: '100', icon: Award, color: 'bg-orange-500' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 data-testid="dashboard-title" className="text-3xl font-bold text-gray-800 mb-2">
          Welcome back, {user?.full_name || 'User'}!
        </h1>
        <p className="text-gray-600">Here's what's happening with your account today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id}
              data-testid={`stat-${stat.id}`}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Information</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p data-testid="user-email" className="font-medium text-gray-800">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Role</p>
              <p data-testid="user-role-display" className="font-medium text-gray-800 capitalize">{user?.role}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Member Since</p>
              <p className="font-medium text-gray-800">Today</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button
              data-testid="quick-action-products"
              onClick={() => onNavigate('products')}
              className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Package className="w-5 h-5" />
              <span className="font-medium">Browse Products</span>
            </button>
            <button
              data-testid="quick-action-cart"
              onClick={() => onNavigate('cart')}
              className="w-full flex items-center gap-3 px-4 py-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="font-medium">View Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
