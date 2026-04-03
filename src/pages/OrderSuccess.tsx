import { CheckCircle, Package } from 'lucide-react';
import { Button } from '../components/ui/Button';

interface OrderSuccessProps {
  orderId?: string;
  onNavigate: (page: string) => void;
}

export function OrderSuccess({ orderId, onNavigate }: OrderSuccessProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-green-100 p-4 rounded-full">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
        </div>

        <h1 data-testid="success-title" className="text-3xl font-bold text-gray-800 mb-2">
          Order Placed Successfully!
        </h1>

        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been confirmed and will be shipped soon.
        </p>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 mb-1">Order ID</p>
          <p data-testid="order-id" className="font-mono font-semibold text-gray-800">
            {orderId || 'N/A'}
          </p>
        </div>

        <div className="space-y-3">
          <Button
            data-testid="continue-shopping-button"
            onClick={() => onNavigate('products')}
            className="w-full"
          >
            <Package className="w-5 h-5" />
            Continue Shopping
          </Button>

          <Button
            data-testid="go-to-dashboard"
            onClick={() => onNavigate('dashboard')}
            variant="secondary"
            className="w-full"
          >
            Go to Dashboard
          </Button>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          You will receive an email confirmation shortly with your order details.
        </p>
      </div>
    </div>
  );
}
