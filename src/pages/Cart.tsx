import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { CartItem, Product } from '../types';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Button } from '../components/ui/Button';
import { Toast } from '../components/ui/Toast';

interface CartProps {
  onNavigate: (page: string) => void;
  onCartUpdate?: () => void;
}

export function Cart({ onNavigate, onCartUpdate }: CartProps) {
  const [cartItems, setCartItems] = useState<(CartItem & { product: Product })[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [updatingItem, setUpdatingItem] = useState<string | null>(null);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        product:products(*)
      `)
      .eq('user_id', user.id);

    if (error) {
      setToast({ message: 'Failed to load cart', type: 'error' });
    } else {
      setCartItems(data as any || []);
      onCartUpdate?.();
    }
    setLoading(false);
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setUpdatingItem(itemId);
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity: newQuantity })
      .eq('id', itemId);

    if (error) {
      setToast({ message: 'Failed to update quantity', type: 'error' });
    } else {
      await loadCart();
      setToast({ message: 'Quantity updated', type: 'success' });
    }
    setUpdatingItem(null);
  };

  const removeItem = async (itemId: string) => {
    setUpdatingItem(itemId);
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId);

    if (error) {
      setToast({ message: 'Failed to remove item', type: 'error' });
    } else {
      await loadCart();
      setToast({ message: 'Item removed from cart', type: 'success' });
    }
    setUpdatingItem(null);
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="mb-8">
        <h1 data-testid="cart-title" className="text-3xl font-bold text-gray-800 mb-2">Shopping Cart</h1>
        <p className="text-gray-600">{cartItems.length} items in your cart</p>
      </div>

      {cartItems.length === 0 ? (
        <div data-testid="empty-cart" className="text-center py-12">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <Button
            data-testid="continue-shopping"
            onClick={() => onNavigate('products')}
          >
            Continue Shopping
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            {cartItems.map((item, index) => (
              <div
                key={item.id}
                data-testid={`cart-item-${item.id}`}
                className={`flex gap-4 p-4 ${index !== cartItems.length - 1 ? 'border-b border-gray-100' : ''}`}
              >
                <img
                  src={item.product.image_url}
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 data-testid={`cart-item-name-${item.id}`} className="font-semibold text-gray-800">
                    {item.product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">${item.product.price} each</p>
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      data-testid={`decrease-quantity-${item.id}`}
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={updatingItem === item.id || item.quantity <= 1}
                      className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span data-testid={`cart-item-quantity-${item.id}`} className="font-medium min-w-[2rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      data-testid={`increase-quantity-${item.id}`}
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={updatingItem === item.id}
                      className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button
                    data-testid={`remove-item-${item.id}`}
                    onClick={() => removeItem(item.id)}
                    disabled={updatingItem === item.id}
                    className="text-red-600 hover:text-red-700 p-2 disabled:opacity-50"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <p data-testid={`cart-item-total-${item.id}`} className="font-semibold text-lg">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-medium text-gray-700">Subtotal</span>
              <span className="text-lg font-medium">${calculateTotal().toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-medium text-gray-700">Shipping</span>
              <span className="text-lg font-medium">$10.00</span>
            </div>
            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-gray-800">Total</span>
                <span data-testid="cart-total" className="text-2xl font-bold text-gray-800">
                  ${(calculateTotal() + 10).toFixed(2)}
                </span>
              </div>
            </div>
            <Button
              data-testid="proceed-to-checkout"
              onClick={() => onNavigate('checkout')}
              className="w-full"
              size="lg"
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
