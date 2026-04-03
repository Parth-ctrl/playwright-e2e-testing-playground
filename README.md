# E2E Test Shop - Playwright Testing Playground

A comprehensive full-stack e-commerce application designed specifically for end-to-end testing with Playwright. This application includes all the features and edge cases needed to practice and master automated testing.

## Features

### Authentication Module
- **Login/Signup System**: JWT-based authentication with Supabase
- **Role-Based Access**: Support for `user` and `admin` roles
- **Protected Routes**: Dashboard and shopping features require authentication
- **Session Management**: Persistent authentication state

### Dashboard
- User profile information display
- Statistics cards with dynamic data
- Quick action buttons
- Role-based content visibility

### Product Management
- **Product Listing**: Grid view with 12 sample products
- **Search Functionality**: Real-time product search
- **Category Filtering**: Filter products by category
- **Add to Cart**: One-click add to cart with loading states
- **Stock Management**: Visual stock indicators

### Shopping Cart
- **Cart Management**: Add, remove, and update quantities
- **Real-time Updates**: Cart badge shows item count
- **Price Calculation**: Automatic subtotal and total calculation
- **Empty State**: User-friendly empty cart message

### Checkout Flow
- **Shipping Address Form**: Complete address validation
- **Payment Information**: Credit card form with validation
- **Payment Simulation**: 2-second delay to simulate processing
- **Order Confirmation**: Success page with order ID

### Complex Form (Testing Practice)
- **Multiple Input Types**: Text, email, phone, select, radio, checkbox
- **File Upload**: Resume upload functionality
- **Validation**: Real-time validation with error messages
- **Form Submission**: Success modal with submitted data preview
- **Reset Functionality**: Clear form data

### UI Components for Testing
- **Loading Spinners**: Visible during async operations
- **Toast Notifications**: Success, error, and info messages
- **Modal Dialogs**: Popup confirmations
- **Animations**: Smooth transitions and animations
- **Responsive Design**: Mobile, tablet, and desktop layouts

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Icons**: Lucide React
- **Animations**: CSS Keyframes

## Database Schema

### Tables
1. **user_profiles**: User information and roles
2. **products**: Product catalog with pricing and inventory
3. **cart_items**: Shopping cart items per user
4. **orders**: Order history
5. **order_items**: Items within each order

## Getting Started

### Prerequisites
- Node.js 18+
- Supabase account (already configured)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Test Accounts

Create test accounts with different roles:

**Regular User:**
- Email: `user@test.com`
- Password: `password123`
- Role: `user`

**Admin User:**
- Email: `admin@test.com`
- Password: `password123`
- Role: `admin`

## Testing Features

### Testability Enhancements

1. **data-testid Attributes**: All interactive elements have stable test IDs
2. **Predictable Selectors**: Consistent naming conventions
3. **Loading States**: Visual indicators for async operations
4. **Error States**: Clear error messages with test IDs
5. **Success States**: Confirmation messages and success pages

### Test Scenarios

#### Authentication Testing
- Login with valid/invalid credentials
- Signup with validation
- Role-based access control
- Session persistence
- Logout functionality

#### Product Testing
- Browse products
- Search products
- Filter by category
- Add to cart
- Stock availability checks

#### Cart Testing
- Add items to cart
- Update quantities
- Remove items
- Cart badge updates
- Empty cart state

#### Checkout Testing
- Form validation
- Payment processing simulation
- Order creation
- Success page navigation
- Cart clearing after order

#### Form Testing
- Field validation
- Error messages
- File upload
- Checkbox/radio buttons
- Form submission
- Form reset

### API Testing

All data operations use Supabase REST API with proper:
- Status codes (200, 400, 401, 500)
- Error handling
- Loading states
- Success confirmations

### Visual Testing

Elements suitable for visual regression testing:
- Product cards
- Dashboard statistics
- Form layouts
- Modal dialogs
- Toast notifications
- Loading spinners

### Responsive Testing

The application is fully responsive with breakpoints for:
- Mobile (< 768px)
- Tablet (768px - 1024px)
- Desktop (> 1024px)

## Playwright Test Examples

### Example: Login Test
```typescript
test('user can login successfully', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('login-email').fill('user@test.com');
  await page.getByTestId('login-password').fill('password123');
  await page.getByTestId('login-submit').click();
  await expect(page.getByTestId('dashboard-title')).toBeVisible();
});
```

### Example: Add to Cart
```typescript
test('user can add product to cart', async ({ page }) => {
  await page.goto('/');
  // Login first
  await page.getByTestId('nav-products').click();
  await page.getByTestId('add-to-cart-1').first().click();
  await expect(page.getByTestId('toast')).toContainText('Added to cart');
  await expect(page.getByTestId('cart-badge')).toContainText('1');
});
```

### Example: Complete Checkout
```typescript
test('user can complete checkout flow', async ({ page }) => {
  // Add items to cart
  // Navigate to checkout
  await page.getByTestId('shipping-fullname').fill('John Doe');
  await page.getByTestId('shipping-address1').fill('123 Main St');
  await page.getByTestId('shipping-city').fill('New York');
  await page.getByTestId('shipping-state').fill('NY');
  await page.getByTestId('shipping-postal').fill('10001');
  await page.getByTestId('card-number').fill('4242424242424242');
  await page.getByTestId('card-expiry').fill('12/25');
  await page.getByTestId('card-cvv').fill('123');
  await page.getByTestId('place-order').click();
  await expect(page.getByTestId('success-title')).toBeVisible();
});
```

## Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── Modal.tsx
│   │   └── Toast.tsx
│   └── Layout.tsx       # Main layout with sidebar
├── contexts/
│   └── AuthContext.tsx  # Authentication state management
├── lib/
│   └── supabase.ts      # Supabase client configuration
├── pages/
│   ├── Login.tsx
│   ├── Signup.tsx
│   ├── Dashboard.tsx
│   ├── Products.tsx
│   ├── Cart.tsx
│   ├── Checkout.tsx
│   ├── OrderSuccess.tsx
│   └── ComplexForm.tsx
├── types/
│   └── index.ts         # TypeScript type definitions
├── App.tsx              # Main app component with routing
├── main.tsx             # Application entry point
└── index.css            # Global styles and animations
```

## Key Testing Points

### Stable Selectors
All interactive elements use `data-testid` for reliable test selection.

### Dynamic Elements
- Loading spinners during API calls
- Toast notifications for user feedback
- Modal dialogs for confirmations
- Delayed responses (2s payment simulation)

### Form Validation
- Real-time validation feedback
- Multiple validation rules
- Error message display
- Success states

### State Management
- Cart count updates
- Authentication state
- Form state
- Loading states

### API Integration
- Create, read, update, delete operations
- Error handling
- Success confirmations
- Real-time updates

## Contributing

This is a testing playground. Feel free to:
- Add more test scenarios
- Enhance existing features
- Report issues
- Improve documentation

## License

MIT License - feel free to use this for learning and testing purposes.
