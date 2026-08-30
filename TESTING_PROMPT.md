# AI Agent Prompt: Generate Complete Unit Test Suite for DentalKart

## Your Role
You are a senior QA automation engineer specializing in React/TypeScript frontends and Node.js/Express backends. Your task is to generate a **complete, production-ready, automated unit/integration test suite** for the DentalKart e-commerce application.

---

## Project Context

### Frontend (`/Users/venkatesh/Desktop/MiniAmazon/web/`)
- **Framework:** React 19 + TypeScript + Vite
- **Routing:** react-router-dom v7
- **State Management:** React Context (CartContext), localStorage for auth/session
- **API Layer:** Plain `fetch` wrappers in `customerApi.ts` and `adminApi.ts`
- **Styling:** Plain CSS in `App.css`, inline styles in some admin pages
- **Structure:** Two apps in one:
  - Customer app at `/` (Header, Footer, Product cards, Cart, Checkout, Orders, Notifications, Profile)
  - Admin app at `/admin` (Dashboard, Products, Categories, Orders, Customers, Complaints, Login)

### Backend (`/Users/venkatesh/Desktop/MiniAmazon/backend/`)
- **Framework:** Express 5 + TypeScript (tsx)
- **Database:** PostgreSQL (`pg` driver), database name: `mini_amazon`
- **Auth:** JWT-based (jsonwebtoken), admin auth middleware
- **Controllers:** `product.controller.ts`, `category.controller.ts`, `order.controller.ts`, `customer.controller.ts`, `admin.controller.ts`, `site.controller.ts`, `notification.controller.ts`, `complaint.controller.ts`
- **Routes:** Separate route files for each resource
- **Key Features:** CRUD for products/categories/orders, image URL uploads, notifications, site settings, complaints/reviews

---

## What You Must Generate

### 1. Install & Configure Testing Infrastructure

#### Frontend (`web/`)
Add these `devDependencies` to `web/package.json`:
```
"vitest": "^3.0.0",
"@testing-library/react": "^16.0.0",
"@testing-library/jest-dom": "^6.6.0",
"@testing-library/user-event": "^14.5.0",
"msw": "^2.6.0",
"jsdom": "^25.0.0",
"@testing-library/react-hooks": "^8.0.1"
```

Create `web/vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
```

Add to `web/package.json` scripts:
```json
"test": "vitest run",
"test:watch": "vitest",
"test:coverage": "vitest run --coverage"
```

#### Backend (`backend/`)
Add these `devDependencies` to `backend/package.json`:
```
"vitest": "^3.0.0",
"supertest": "^7.0.0",
"@types/supertest": "^6.0.0"
```

Create `backend/vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    include: ['src/**/*.test.ts'],
    testTimeout: 10000,
  },
});
```

Add to `backend/package.json` scripts:
```json
"test": "vitest run",
"test:watch": "vitest",
"test:coverage": "vitest run --coverage"
```

---

### 2. Frontend Test Files to Create

#### A. `web/src/test/setup.ts`
```ts
import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import { handlers } from './mocks/handlers';
import { setupServer } from 'msw/node';

const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  server.resetHandlers();
  cleanup();
});
afterAll(() => server.close());
```

#### B. `web/src/test/mocks/handlers.ts`
Create comprehensive MSW handlers for **ALL** API endpoints:

**Customer API endpoints:**
- `GET /api/products` → returns mock products array
- `GET /api/categories` → returns mock categories array
- `GET /api/orders` → returns mock orders array
- `POST /api/orders` → returns created order
- `GET /api/customers/me` → returns current customer
- `PUT /api/customers/me` → returns updated customer
- `GET /api/notifications` → returns mock notifications with pagination
- `GET /api/notifications/unread-count` → returns `{ count: number }`
- `PUT /api/notifications/:id/read` → returns success
- `PUT /api/notifications/mark-all-read` → returns success
- `GET /api/site/settings` → returns `{ settings: { logo_url: string, ... } }`
- `POST /api/auth/login` → returns `{ token, customer }`
- `POST /api/auth/signup` → returns `{ token, customer }`

**Admin API endpoints:**
- `POST /api/admin/login` → returns `{ token, admin }`
- `GET /api/admin/products` → returns `{ products: [...] }`
- `POST /api/admin/products` → returns created product
- `PUT /api/admin/products/:id` → returns updated product
- `DELETE /api/admin/products/:id` → returns success
- `GET /api/admin/categories` → returns `{ categories: [...] }`
- `POST /api/admin/categories` → returns created category
- `PUT /api/admin/categories/:id` → returns updated category
- `DELETE /api/admin/categories/:id` → returns success
- `GET /api/admin/orders` → returns `{ orders: [...] }`
- `PUT /api/admin/orders/:id/status` → returns updated order
- `GET /api/admin/orders/stats` → returns stats object
- `GET /api/admin/customers` → returns `{ customers: [...] }`
- `GET /api/admin/complaints` → returns `{ complaints: [...] }`
- `PUT /api/admin/complaints/:id/status` → returns updated complaint
- `GET /api/site/settings` → returns `{ settings: {...} }`
- `PUT /api/site/settings` → returns updated setting
- `PUT /api/admin/profile` → returns updated admin profile

#### C. `web/src/test/utils.tsx`
```tsx
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from '../customer/context/CartContext';

export function renderWithProviders(ui: React.ReactElement, options = {}) {
  return render(
    <BrowserRouter>
      <CartProvider>
        {ui}
      </CartProvider>
    </BrowserRouter>,
    options
  );
}

// Mock localStorage
export const mockLocalStorage = () => {
  const store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { Object.keys(store).forEach(k => delete store[k]); },
  };
};
```

---

### 3. Detailed Test Cases by Module

#### **Module 1: CartContext** (`web/src/customer/context/__tests__/CartContext.test.tsx`)

**Test cases:**
1. `addToCart` - adds new product with quantity 1
2. `addToCart` - increases quantity when same product added again
3. `removeFromCart` - removes product from cart
4. `increaseQuantity` - increases quantity by 1
5. `decreaseQuantity` - decreases quantity by 1
6. `decreaseQuantity` - removes item when quantity reaches 0
7. `clearCart` - empties entire cart
8. `cartCount` - calculates total items correctly
9. `cartTotal` - calculates total price correctly (price * quantity)
10. localStorage persistence - cart persists after remount
11. localStorage persistence - cart loads on initialization
12. `useCart` hook throws error when used outside CartProvider

**Implementation notes:**
- Use `renderHook` from `@testing-library/react`
- Wrap with custom CartProvider (not the context one, but a test wrapper that provides the context)
- Mock localStorage using `vi.spyOn`
- Test with multiple products: `{ id: 1, name: 'Toothbrush', price: 50 }, { id: 2, name: 'Paste', price: 30 }`

---

#### **Module 2: Header Component** (`web/src/customer/components/__tests__/Header.test.tsx`)

**Test cases:**
1. Renders logo (text "DentalKart" or image if logo_url exists)
2. Renders search input with correct placeholder
3. Renders cart button with cart count badge
4. Shows notification bell when user is logged in
5. Shows unread count badge on notification bell
6. Shows login button when user is not logged in
7. Shows logout button and profile when user is logged in
8. Menu dropdown opens on hamburger click
9. Menu dropdown closes on outside click
10. Menu dropdown closes on Escape key
11. Menu dropdown is rendered via portal to document.body
12. Profile image displays when available
13. Search clear button appears when text entered
14. Calls `onSearchChange` when typing in search
15. Calls `onCartClick` when cart button clicked
16. Calls `onLoginClick` when login button clicked
17. Calls `onLogoutClick` when logout button clicked

**Implementation notes:**
- Mock `getSiteSettings` and `getUnreadNotificationCount` from `customerApi`
- Mock `localStorage.getItem` for auth state
- Use `userEvent.setup()` for click interactions
- Use `window.confirm` mock if needed for dialogs

---

#### **Module 3: Footer Component** (`web/src/customer/components/__tests__/Footer.test.tsx`)

**Test cases:**
1. Renders copyright with current year
2. Renders all 4 social media links (Instagram, Facebook, LinkedIn, WhatsApp)
3. Each social link has correct href attribute
4. Each social link has correct aria-label
5. Renders quick links section with correct links
6. Renders contact information
7. Links open in new tab (`target="_blank"`)
8. Links have `rel="noopener noreferrer"`

**Implementation notes:**
- Use `screen.getByRole('link', { name: /instagram/i })` pattern
- Verify hrefs match actual social profile URLs

---

#### **Module 4: ProductCard Component** (`web/src/customer/components/__tests__/ProductCard.test.tsx`)

**Test cases:**
1. Renders product name
2. Renders product price formatted as Indian Rupees
3. Renders product image (or placeholder if no image)
4. Renders "View Details" button
5. Renders "Add to Cart" button
6. Calls `onViewDetails` when image clicked
7. Calls `onViewDetails` when "View Details" clicked
8. Calls `onAdded` when "Add to Cart" clicked
9. Shows out of stock state when stock is 0
10. Disables "Add to Cart" when out of stock
11. Shows discount badge when originalPrice > price
12. Shows truncated description

**Implementation notes:**
- Mock `useCart` from CartContext
- Use `jest.mocked` or manual mock for `addToCart`
- Test with product: `{ id: 1, name: 'Test Product', price: 100, stock: 5, image: 'url', description: 'desc' }`

---

#### **Module 5: Customer Login Page** (`web/src/customer/pages/__tests__/LoginPage.test.tsx`)

**Test cases:**
1. Renders email and password inputs
2. Renders submit button
3. Submits with valid credentials
4. Calls correct API endpoint (`/api/auth/login`)
5. Stores token in localStorage on success
6. Stores customer data in localStorage on success
7. Calls `onLoginSuccess` callback
8. Shows error message on invalid credentials
9. Shows error on network failure
10. Disables button during submission
11. Clears error when user starts typing

---

#### **Module 6: Customer Products Page** (`web/src/customer/pages/__tests__/ProductsPage.test.tsx`)

**Test cases:**
1. Renders product grid on load
2. Shows loading state initially
3. Shows error message on API failure
4. Category filter updates displayed products
5. Search input filters products by name
6. Shows "No products found" when filter matches nothing
7. Renders ProductCard for each product
8. Pagination controls appear when needed
9. Pagination changes page correctly
10. Calls `onAddToCart` when product added

---

#### **Module 7: Customer Cart Page** (`web/src/customer/pages/__tests__/CartPage.test.tsx`)

**Test cases:**
1. Renders cart items from CartContext
2. Shows empty cart message when cart is empty
3. Quantity increment button works
4. Quantity decrement button works
5. Remove item button removes item
6. Shows correct cart total
7. Shows correct item count
8. Checkout button navigates to address page
9. Continue shopping button works
10. Cart persists across page refreshes (localStorage)

---

#### **Module 8: Customer Notifications Page** (`web/src/customer/pages/__tests__/NotificationsPage.test.tsx`)

**Test cases:**
1. Renders notification list
2. Shows loading state
3. Shows error on API failure
4. Displays notification title and message
5. Shows notification date
6. Mark as read button changes notification status
7. Mark all as read button works
8. Shows empty state when no notifications
9. Pagination loads more notifications
10. Unread count badge updates

---

#### **Module 9: Admin Login Page** (`web/src/admin/pages/__tests__/AdminLoginPage.test.tsx`)

**Test cases:**
1. Renders email and password inputs
2. Submits with valid admin credentials
3. Stores admin token in `mini-amazon-admin-token`
4. Redirects to admin dashboard on success
5. Shows error on invalid credentials
6. Shows error on network failure

---

#### **Module 10: Admin Products Page** (`web/src/admin/pages/__tests__/AdminProductsPage.test.tsx`)

**Test cases:**
1. Renders products table
2. Shows loading state
3. Shows error on API failure
4. "Add Product" button opens add form
5. Add form has all required fields (category, name, price, stock, description, active, image)
6. Submitting add form creates product
7. Validates required fields (category, name, price)
8. Validates price is non-negative
9. Validates stock is non-negative
10. Image upload validates file size (max 5MB)
11. Image preview shows after upload
12. Edit button populates edit form
13. Edit form pre-fills with existing data
14. Submitting edit form updates product
15. Cancel button closes form
16. Delete button shows confirmation dialog
17. Delete removes product from list
18. Search filters products by ID or name
19. Pagination controls work
20. Page resets to 1 when search query changes

**Implementation notes:**
- Mock all admin API functions
- Mock `window.confirm` for delete confirmation
- Test file input with `File` object mock
- Use `waitFor` for async operations

---

#### **Module 11: Admin Categories Page** (`web/src/admin/pages/__tests__/AdminCategoriesPage.test.tsx`)

**Test cases:**
1. Renders categories list
2. Add category form works
3. Edit category works
4. Delete category works
5. Category name validation

---

#### **Module 12: Admin Orders Page** (`web/src/admin/pages/__tests__/AdminOrdersPage.test.tsx`)

**Test cases:**
1. Renders orders table
2. Status dropdown updates order status
3. Order details display correctly
4. Search/filter orders
5. Pagination works

---

#### **Module 13: Admin Dashboard Page** (`web/src/admin/pages/__tests__/AdminDashboardPage.test.tsx`)

**Test cases:**
1. Renders stats cards
2. Loads stats from API
3. Sidebar navigation works
4. Notifications section displays
5. Profile section displays

---

#### **Module 14: API Layer Tests**

**`web/src/admin/api/__tests__/adminApi.test.ts`:**
1. `adminLogin` sends correct credentials
2. `adminLogin` stores token
3. `adminGet` includes auth header when token exists
4. `adminGet` throws on non-ok response
5. `adminPost` sends JSON body
6. `adminPut` sends JSON body
7. `adminDelete` sends DELETE request
8. `getAdminStats` calls correct endpoint
9. `getAdminProducts` calls correct endpoint
10. `updateSiteSetting` sends correct payload

**`web/src/customer/api/__tests__/customerApi.test.ts`:**
1. `customerGet` sends GET request
2. `customerPost` sends POST with JSON body
3. `getNotifications` builds query params correctly
4. `getUnreadNotificationCount` builds query params correctly
5. `markNotificationRead` sends PUT request
6. `markAllNotificationsRead` sends correct payload
7. Error handling for non-json responses
8. Error handling for non-ok responses

---

### 4. Backend Test Files to Create

#### A. `backend/src/__tests__/controllers/product.controller.test.ts`

**Test cases:**
1. `getProducts` returns paginated products
2. `getProducts` respects page and limit params
3. `getProducts` filters by category_id
4. `getProducts` filters by is_active
5. `createProduct` creates product with valid data
6. `createProduct` validates required fields
7. `createProduct` validates price > 0
8. `createProduct` validates stock >= 0
9. `updateProduct` updates existing product
10. `updateProduct` returns 404 for non-existent product
11. `deleteProduct` deletes product
12. `deleteProduct` returns 404 for non-existent product

---

#### B. `backend/src/__tests__/controllers/category.controller.test.ts`

**Test cases:**
1. `getCategories` returns all categories
2. `createCategory` creates with valid name
3. `createCategory` rejects duplicate names
4. `updateCategory` updates existing
5. `deleteCategory` deletes with no products
6. `deleteCategory` rejects when products exist

---

#### C. `backend/src/__tests__/controllers/order.controller.test.ts`

**Test cases:**
1. `createOrder` creates order with valid data
2. `createOrder` validates required fields
3. `createOrder` creates order_history entry
4. `getOrders` returns orders for customer
5. `getOrders` returns all orders for admin
6. `updateOrderStatus` updates status
7. `getOrderStats` returns correct stats

---

#### D. `backend/src/__tests__/controllers/admin.controller.test.ts`

**Test cases:**
1. `adminLogin` returns token for valid credentials
2. `adminLogin` rejects invalid password
3. `adminLogin` rejects non-existent email
4. `getAdminProfile` returns profile with token
5. `updateAdminProfile` updates name and image_url
6. `getAdminStats` returns stats

---

#### E. `backend/src/__tests__/controllers/customer.controller.test.ts`

**Test cases:**
1. `getCustomers` returns all customers (admin)
2. `getCustomerProfile` returns current customer
3. `updateCustomerProfile` updates profile
4. `customerLogin` returns token
5. `customerSignup` creates new customer

---

#### F. `backend/src/__tests__/controllers/site.controller.test.ts`

**Test cases:**
1. `getSiteSettings` returns all settings (public)
2. `updateSiteSetting` updates as admin
3. `updateSiteSetting` rejects as non-admin

---

#### G. `backend/src/__tests__/controllers/notification.controller.test.ts`

**Test cases:**
1. `getNotifications` returns paginated notifications
2. `getNotifications` filters by role and reference_id
3. `markNotificationRead` marks as read
4. `markAllNotificationsRead` marks all as read
5. `getUnreadCount` returns correct count
6. `createNotification` creates notification (admin)

---

#### H. `backend/src/__tests__/controllers/complaint.controller.test.ts`

**Test cases:**
1. `getComplaints` returns all (admin)
2. `createComplaint` creates for customer
3. `updateComplaintStatus` updates status
4. `addComplaintReply` adds reply

---

#### I. `backend/src/__tests__/routes/admin.routes.test.ts`

**Test cases:**
1. Admin login route works
2. Protected routes return 401 without token
3. Protected routes work with valid token
4. Admin routes reject customer tokens

---

### 5. Test Execution & Coverage Requirements

#### Commands to run:
```bash
# Frontend
cd web
npm install
npm run test
npm run test:coverage

# Backend
cd backend
npm install
npm run test
npm run test:coverage
```

#### Coverage Targets:
- Frontend: Minimum 80% line coverage for components and contexts
- Backend: Minimum 85% line coverage for controllers
- All tests must pass in CI environment
- No flaky tests (avoid timing dependencies)

---

### 6. Critical Implementation Requirements

1. **Mock all API calls** - Never hit real backend in frontend tests
2. **Mock localStorage** - Use `vi.spyOn` or mock implementation
3. **Use MSW for network mocking** - Consistent request/response handling
4. **Test user interactions** - Use `userEvent.setup()` not `fireEvent`
5. **Test accessibility** - Include `aria-label`, `role`, `alt` text checks
6. **Clean up after each test** - Reset mocks, clear localStorage
7. **Use `waitFor` for async operations** - Don't use arbitrary `sleep()`
8. **Test error states** - Not just happy paths
9. **Test loading states** - Verify UI feedback during async ops
10. **Use semantic queries** - `getByRole`, `getByLabelText` over `getByTestId`

---

### 7. File Structure Summary

```
web/src/
├── test/
│   ├── setup.ts
│   ├── utils.tsx
│   └── mocks/
│       ├── handlers.ts
│       └── data.ts (mock data fixtures)
├── customer/
│   ├── context/
│   │   └── __tests__/
│   │       └── CartContext.test.tsx
│   ├── components/
│   │   └── __tests__/
│   │       ├── Header.test.tsx
│   │       ├── Footer.test.tsx
│   │       └── ProductCard.test.tsx
│   ├── pages/
│   │   └── __tests__/
│   │       ├── LoginPage.test.tsx
│   │       ├── ProductsPage.test.tsx
│   │       ├── CartPage.test.tsx
│   │       └── NotificationsPage.test.tsx
│   └── api/
│       └── __tests__/
│           └── customerApi.test.ts
├── admin/
│   ├── pages/
│   │   └── __tests__/
│   │       ├── AdminLoginPage.test.tsx
│   │       ├── AdminProductsPage.test.tsx
│   │       ├── AdminCategoriesPage.test.tsx
│   │       ├── AdminOrdersPage.test.tsx
│   │       └── AdminDashboardPage.test.tsx
│   └── api/
│       └── __tests__/
│           └── adminApi.test.ts

backend/src/
├── __tests__/
│   ├── controllers/
│   │   ├── product.controller.test.ts
│   │   ├── category.controller.test.ts
│   │   ├── order.controller.test.ts
│   │   ├── admin.controller.test.ts
│   │   ├── customer.controller.test.ts
│   │   ├── site.controller.test.ts
│   │   ├── notification.controller.test.ts
│   │   └── complaint.controller.test.ts
│   └── routes/
│       └── admin.routes.test.ts
```

---

### 8. Deliverables

Generate ALL of the following:

1. **Frontend test infrastructure:**
   - `web/vitest.config.ts`
   - `web/src/test/setup.ts`
   - `web/src/test/utils.tsx`
   - `web/src/test/mocks/handlers.ts`
   - `web/src/test/mocks/data.ts` (shared mock data)

2. **Frontend test files** (all listed in section 3)

3. **Backend test infrastructure:**
   - `backend/vitest.config.ts`
   - `backend/src/__tests__/setup.ts` (test database setup if needed)

4. **Backend test files** (all listed in section 4)

5. **Updated `package.json` files** for both `web/` and `backend/` with test scripts and devDependencies

6. **README.md** section explaining how to run tests

---

## Important Constraints

- **Do NOT use React Router's `useNavigate` directly** - use `MemoryRouter` or mock it
- **Do NOT test implementation details** - test behavior and UI
- **Keep tests independent** - each test must pass in isolation
- **Use `data-testid` sparingly** - prefer semantic queries
- **Mock at the appropriate level** - API layer, not individual functions
- **Type safety** - All tests must pass `tsc --noEmit`
- **No console errors** - Tests must not produce unexpected console output

---

## Expected Output Format

For each test file, provide:
1. Full file path
2. Complete file contents (no placeholders like `// ... rest of tests`)
3. Brief explanation of what it tests

Start with infrastructure files first, then test files grouped by module.

---

## Final Verification

After generating all files, provide:
1. Exact commands to install dependencies
2. Exact commands to run tests
3. Expected coverage report summary
4. Any manual setup steps needed (database, environment variables)

---

## Project-Specific Details

### Mock Data to Use

**Sample Product:**
```ts
{
  id: 1,
  category_id: 1,
  category_name: "Toothbrushes",
  name: "Test Toothbrush",
  description: "A test toothbrush",
  price: 99.99,
  stock: 50,
  is_active: true,
  image_url: "https://example.com/image.jpg",
  created_at: "2024-01-01T00:00:00Z"
}
```

**Sample Customer:**
```ts
{
  id: 1,
  name: "Test User",
  email: "test@example.com",
  phone: "9876543210",
  address: "123 Test St",
  city: "Test City",
  state: "Test State",
  pincode: "123456",
  image_url: null
}
```

**Sample Order:**
```ts
{
  id: 1,
  order_number: "ORD-1001",
  customer_id: 1,
  customer_name: "Test User",
  customer_email: "test@example.com",
  customer_phone: "9876543210",
  shipping_address: "123 Test St",
  shipping_city: "Test City",
  shipping_state: "Test State",
  shipping_pincode: "123456",
  items: [{ product_id: 1, name: "Test", price: 99.99, quantity: 2 }],
  shipping_cost: 40,
  order_status: "pending",
  payment_status: "pending",
  created_at: "2024-01-01T00:00:00Z"
}
```

---

**BEGIN GENERATION NOW. Generate ALL files listed above. Do not skip any test files. Ensure every test is complete and runnable.**
