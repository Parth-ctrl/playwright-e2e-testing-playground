import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { CartItem, Product, ShippingAddress } from '../types';
import { CreditCard, Lock } from 'lucide-react';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Button } from '../components/ui/Button';
import { Toast } from '../components/ui/Toast';

interface CheckoutProps {
  onNavigate: (page: string, orderId?: string) => void;
}

export function Checkout({ onNavigate }: CheckoutProps) {
  const [cartItems, setCartItems] = useState<(CartItem & { product: Product })[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    full_name: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'USA',
  });

  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    }
    setLoading(false);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!shippingAddress.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    }
    if (!shippingAddress.address_line1.trim()) {
      newErrors.address_line1 = 'Address is required';
    }
    if (!shippingAddress.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!shippingAddress.state.trim()) {
      newErrors.state = 'State is required';
    }
    if (!shippingAddress.postal_code.trim()) {
      newErrors.postal_code = 'Postal code is required';
    }
    if (!cardNumber.trim()) {
      newErrors.cardNumber = 'Card number is required';
    } else if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = 'Invalid card number';
    }
    if (!cardExpiry.trim()) {
      newErrors.cardExpiry = 'Expiry date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
      newErrors.cardExpiry = 'Invalid format (MM/YY)';
    }
    if (!cardCvv.trim()) {
      newErrors.cardCvv = 'CVV is required';
    } else if (!/^\d{3,4}$/.test(cardCvv)) {
      newErrors.cardCvv = 'Invalid CVV';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0) + 10;
  };

  const processPayment = async () => {
    if (!validateForm()) {
      setToast({ message: 'Please fill in all required fields', type: 'error' });
      return;
    }

    setProcessing(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setToast({ message: 'User not authenticated', type: 'error' });
      setProcessing(false);
      return;
    }

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        total_amount: calculateTotal(),
        status: 'completed',
        payment_method: paymentMethod,
        shipping_address: shippingAddress,
      })
      .select()
      .single();

    if (orderError) {
      setToast({ message: 'Failed to create order', type: 'error' });
      setProcessing(false);
      return;
    }

    const orderItems = cartItems.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.product.price,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      setToast({ message: 'Failed to save order items', type: 'error' });
      setProcessing(false);
      return;
    }

    await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id);

    setProcessing(false);
    onNavigate('order-success', order.id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center py-12">
        <p className="text-gray-600 mb-4">Your cart is empty</p>
        <Button onClick={() => onNavigate('products')}>
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="mb-8">
        <h1 data-testid="checkout-title" className="text-3xl font-bold text-gray-800 mb-2">Checkout</h1>
        <p className="text-gray-600">Complete your order</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Shipping Address</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  id="full_name"
                  data-testid="shipping-fullname"
                  type="text"
                  value={shippingAddress.full_name}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, full_name: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg ${errors.full_name ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.full_name && <p data-testid="error-fullname" className="text-red-500 text-sm mt-1">{errors.full_name}</p>}
              </div>

              <div>
                <label htmlFor="address_line1" className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 1
                </label>
                <input
                  id="address_line1"
                  data-testid="shipping-address1"
                  type="text"
                  value={shippingAddress.address_line1}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, address_line1: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg ${errors.address_line1 ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.address_line1 && <p className="text-red-500 text-sm mt-1">{errors.address_line1}</p>}
              </div>

              <div>
                <label htmlFor="address_line2" className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 2 (Optional)
                </label>
                <input
                  id="address_line2"
                  data-testid="shipping-address2"
                  type="text"
                  value={shippingAddress.address_line2}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, address_line2: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    id="city"
                    data-testid="shipping-city"
                    type="text"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>

                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    id="state"
                    data-testid="shipping-state"
                    type="text"
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code
                  </label>
                  <input
                    id="postal_code"
                    data-testid="shipping-postal"
                    type="text"
                    value={shippingAddress.postal_code}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, postal_code: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg ${errors.postal_code ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.postal_code && <p className="text-red-500 text-sm mt-1">{errors.postal_code}</p>}
                </div>

                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    id="country"
                    data-testid="shipping-country"
                    type="text"
                    value={shippingAddress.country}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-800">Payment Information</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="payment_method" className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <select
                  id="payment_method"
                  data-testid="payment-method"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="credit_card">Credit Card</option>
                  <option value="debit_card">Debit Card</option>
                  <option value="paypal">PayPal</option>
                </select>
              </div>

              <div>
                <label htmlFor="card_number" className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="card_number"
                    data-testid="card-number"
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'}`}
                  />
                </div>
                {errors.cardNumber && <p data-testid="error-card-number" className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="card_expiry" className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    id="card_expiry"
                    data-testid="card-expiry"
                    type="text"
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg ${errors.cardExpiry ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.cardExpiry && <p className="text-red-500 text-sm mt-1">{errors.cardExpiry}</p>}
                </div>

                <div>
                  <label htmlFor="card_cvv" className="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <input
                    id="card_cvv"
                    data-testid="card-cvv"
                    type="text"
                    placeholder="123"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg ${errors.cardCvv ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.cardCvv && <p className="text-red-500 text-sm mt-1">{errors.cardCvv}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.product.name} x{item.quantity}</span>
                  <span className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-3 space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${(calculateTotal() - 10).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">$10.00</span>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-3 mb-6">
              <div className="flex justify-between">
                <span className="text-lg font-semibold">Total</span>
                <span data-testid="order-total" className="text-xl font-bold">${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
            <Button
              data-testid="place-order"
              onClick={processPayment}
              isLoading={processing}
              className="w-full"
              size="lg"
            >
              {processing ? 'Processing...' : 'Place Order'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
