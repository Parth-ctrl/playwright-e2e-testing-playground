import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { Products } from './pages/Products';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { OrderSuccess } from './pages/OrderSuccess';
import { ComplexForm } from './pages/ComplexForm';
import { Layout } from './components/Layout';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { supabase } from './lib/supabase';

type Page = 'login' | 'signup' | 'dashboard' | 'products' | 'cart' | 'checkout' | 'order-success' | 'complex-form';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [orderId, setOrderId] = useState<string | undefined>();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (!loading && user) {
      setCurrentPage('dashboard');
      loadCartCount();
    } else if (!loading && !user) {
      setCurrentPage('login');
    }
  }, [user, loading]);

  const loadCartCount = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('cart_items')
      .select('quantity')
      .eq('user_id', user.id);

    if (data) {
      const total = data.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(total);
    }
  };

  const handleNavigate = (page: string, data?: string) => {
    setCurrentPage(page as Page);
    if (page === 'order-success' && data) {
      setOrderId(data);
    }
    if (page === 'cart' || page === 'products') {
      loadCartCount();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    if (currentPage === 'signup') {
      return <Signup onNavigateToLogin={() => setCurrentPage('login')} />;
    }
    return <Login onNavigateToSignup={() => setCurrentPage('signup')} />;
  }

  if (currentPage === 'order-success') {
    return <OrderSuccess orderId={orderId} onNavigate={handleNavigate} />;
  }

  return (
    <Layout currentPage={currentPage} onNavigate={handleNavigate} cartItemCount={cartCount}>
      {currentPage === 'dashboard' && <Dashboard onNavigate={handleNavigate} />}
      {currentPage === 'products' && <Products />}
      {currentPage === 'cart' && <Cart onNavigate={handleNavigate} onCartUpdate={loadCartCount} />}
      {currentPage === 'checkout' && <Checkout onNavigate={handleNavigate} />}
      {currentPage === 'complex-form' && <ComplexForm />}
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
