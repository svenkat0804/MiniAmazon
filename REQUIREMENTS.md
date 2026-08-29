# DentalKart — Updated Requirements Specification

**Based on existing codebase audit — 2026-08-29**

---

## 1. Project Overview

DentalKart is a dental products e-commerce platform consisting of:
1. **Customer-facing Web App** — browse, search, cart, checkout, orders, support
2. **Admin Panel** — manage products, orders, customers, complaints, analytics
3. **Backend API** — Express + PostgreSQL REST API
4. **Database** — PostgreSQL with relational schema

**Current Status:** MVP partially implemented. Core customer flow and admin CRUD are functional. Advanced features (real auth, payments, shipping, reviews, etc.) are pending.

---

## 2. Actual Tech Stack

| Layer | Current Choice | Notes |
|-------|---------------|-------|
| Frontend (customer) | React 19 + Vite + TypeScript | Single-page app with react-router-dom |
| Frontend (admin) | React 19 + Vite + TypeScript | Inline styles, separate from customer app |
| Styling | Plain CSS (`App.css`) | No framework; ~5,500 lines, responsive at 520/768/1100px |
| Backend | Express 5 + TypeScript | REST API with JWT admin auth |
| Database | PostgreSQL | Raw SQL via `pg` pool; no ORM |
| Auth | JWT (admin only) | `jsonwebtoken` + `bcrypt` |
| Customer session | localStorage | Mock auth; no backend customer accounts yet |
| File storage | External URLs | Unsplash/Pexels placeholders; no uploads yet |

**Deviations from original spec:**
- No Next.js (using Vite instead)
- No Tailwind CSS (using plain CSS)
- No Prisma (using raw SQL)
- No Redis, email, or CDN yet

---

## 3. User Roles (Current)

| Role | Implementation | Access |
|------|---------------|--------|
| Guest | localStorage session | Browse, search, add to cart, checkout (mock) |
| Customer | localStorage mock auth | Order history, support tickets, profile (limited) |
| Admin | JWT token | Full dashboard access |

**Missing:** Staff/Sub-admin roles (planned Phase 2)

---

## 4. Customer Web App — Current State

### 4.1 Implemented Features

**Authentication & Account**
- Mock login/signup (localStorage only, no backend)
- Demo login: any email/password works
- No email verification, password reset, or profile management

**Product Catalog**
- Home page with hero banner, stats, categories, featured categories
- Product grid with images, names, prices
- Category filtering (dropdown)
- Price range filtering (min/max inputs)
- Sort: default, price low/high, name A-Z/Z-A
- Product detail page with description and add-to-cart
- Search by product name (real-time)
- Product data fetched from backend API with static fallback

**Cart & Checkout**
- Add/remove items, quantity adjustment
- Cart persists in localStorage
- Cart toast notification
- Checkout flow: hardcoded address → payment method → order confirmation
- Payment simulation (70% success rate for online, instant for COD)
- Order saved to backend API + localStorage

**Orders**
- Order history with Live/Past tabs
- Order detail with 5-step tracking timeline
- Tracking info persisted in localStorage
- Backend API integration for orders

**Support**
- Support/complaint form page
- Submits to backend `/api/admin/complaints`

**Other**
- Responsive design (breakpoints: 520px, 768px, 1100px)
- Header with search, auth, cart, menu dropdown
- Footer with links

### 4.2 Missing Features

| Feature | Status | Notes |
|---------|--------|-------|
| Real customer authentication | Not started | No backend customer accounts, no password hashing |
| Email verification | Not started | |
| Password reset | Not started | |
| Profile management | Not started | No edit profile page |
| Multiple addresses | Not started | Hardcoded address only |
| Product reviews/ratings | Not started | DB table exists, no frontend |
| Wishlist | Not started | DB table exists, no frontend |
| Coupon/promo codes | Not started | DB table exists, no frontend |
| Product variants | Not started | DB table exists, no frontend |
| Recently viewed | Not started | |
| Real payment gateway | Not started | Razorpay integration pending |
| Order cancellation | Not started | Admin can mark cancelled, no customer flow |
| Return/refund request | Not started | Complaint system exists but not tied to orders |
| Email notifications | Not started | No email service |
| About/Contact pages | Partial | Routes exist, no content pages |
| Product image upload | Not started | External URLs only |

---

## 5. Admin Panel — Current State

### 5.1 Implemented Modules

**Dashboard**
- Stats cards: total orders, customers, products, revenue
- Recent orders list
- Recent complaints list
- Data fetched from backend API

**Products Management**
- Full CRUD (create, read, update, delete)
- Fields: category, name, description, price, stock, active/inactive
- Table view with search/filter
- Add/Edit modal forms
- Image URL field (no upload)

**Categories Management**
- Full CRUD
- Table view with Edit/Delete
- Name only (no image upload, no parent categories)

**Orders Management**
- List all orders with filters (status, payment status)
- Order detail modal with:
  - Customer info
  - Shipping address
  - Order items with totals
  - Payment info
  - Status history timeline
- Update order status with note
- Update payment status

**Customers Management**
- List all customers with search
- Customer detail modal with:
  - Personal info
  - Address
  - Order history with totals
- Edit customer details

**Complaints/Support Management**
- List all complaints with status filter
- Complaint detail modal
- Update status (open → in_progress → resolved → closed)

### 5.2 Missing Modules

| Module | Status | Notes |
|--------|--------|-------|
| Inventory Management | Placeholder | Sidebar link exists, no page |
| Analytics/Reports | Partial | Basic stats only, no charts or date range |
| Coupons Management | Not started | DB table exists, no admin page |
| Reviews Moderation | Not started | DB table exists, no admin page |
| Staff/Roles | Not started | Single admin role only |
| Settings | Not started | No store config page |
| Bulk import/export | Not started | |
| Shipment management | Not started | DB table exists, no admin page |

---

## 6. Backend API — Current State

### 6.1 Implemented Endpoints

**Admin (JWT protected)**
- `POST /api/admin/login` — Admin login
- `GET /api/admin/profile` — Admin profile
- `GET /api/admin/products` — List products
- `GET /api/admin/products/:id` — Single product
- `POST /api/admin/products` — Create product
- `PUT /api/admin/products/:id` — Update product
- `DELETE /api/admin/products/:id` — Delete product
- `GET /api/admin/customers` — List customers
- `GET /api/admin/customers/:id` — Single customer
- `POST /api/admin/customers` — Create customer
- `PUT /api/admin/customers/:id` — Update customer
- `GET /api/admin/orders` — List orders (with filters)
- `GET /api/admin/orders/stats` — Order statistics
- `GET /api/admin/orders/:id` — Order details with history
- `PUT /api/admin/orders/:id/status` — Update order status
- `PUT /api/admin/orders/:id/payment` — Update payment status
- `GET /api/admin/complaints` — List complaints
- `PUT /api/admin/complaints/:id/status` — Update complaint status

**Public (no auth)**
- `GET /api/health` — Health check
- `GET /api/categories` — List categories
- `GET /api/categories/:id` — Single category
- `POST /api/orders` — Create order
- `GET /api/orders/customer/:email` — Get orders by email
- `POST /api/admin/complaints` — Submit complaint

### 6.2 Missing Endpoints

| Feature | Status | Notes |
|---------|--------|-------|
| Customer registration | Not started | No endpoint |
| Customer login | Not started | No endpoint |
| Customer profile | Not started | No endpoint |
| Product search | Not started | Client-side only |
| Product images upload | Not started | |
| Cart API | Not started | Cart is localStorage only |
| Coupons validation | Not started | |
| Payment gateway | Not started | No Razorpay integration |
| Shipment tracking | Not started | |
| Email/notifications | Not started | |

### 6.3 Critical Issues

1. **Category routes are unprotected** — `POST/PUT/DELETE /api/categories` have no auth
2. **No customer auth** — Customer login/signup are mock implementations
3. **Database setup incomplete** — `setup.ts` references `admins` table before creating it; `products`/`categories` seed data may fail
4. **No input validation** — Beyond basic checks, no Zod/Joi validation
5. **No rate limiting** — Auth endpoints are vulnerable to brute force
6. **Hardcoded secrets** — `.env` file contains real credentials, no `.env.example`

---

## 7. Database Schema — Current State

### Tables That Exist / Are Defined

| Table | Columns | Status |
|-------|---------|--------|
| `admins` | id, name, email, password_hash, role, is_active, timestamps | Defined in setup, may not create due to ordering |
| `categories` | id, name, image_url, parent_id, timestamps | Defined |
| `products` | id, name, slug, description, category_id, base_price, status, timestamps | Defined |
| `product_images` | id, product_id, url, sort_order, timestamps | Defined |
| `product_variants` | id, product_id, sku, attributes, price, stock_quantity, image_url, timestamps | Defined |
| `reviews` | id, product_id, user_id, rating, comment, status, timestamps | Defined |
| `wishlists` | id, user_id, product_id, timestamps, unique(user_id, product_id) | Defined |
| `coupons` | id, code, type, value, min_order_value, usage_limit, used_count, expires_at, is_active, timestamps | Defined |
| `customers` | id, name, email, phone, address, city, state, pincode, timestamps | Defined |
| `orders` | id, user_id, order_number, status, subtotal, discount, tax, shipping_fee, total, payment_status, payment_method, shipping_address (JSONB), timestamps | Defined |
| `order_items` | id, order_id, product_variant_id, product_name_snapshot, price_snapshot, quantity | Defined |
| `order_status_history` | id, order_id, status, note, timestamps | Defined |
| `payments` | id, order_id, provider, razorpay_* fields, method, amount, currency, status, timestamps | Defined |
| `shipments` | id, order_id, courier_partner, aggregator, awb_number, shipment_status, addresses, est_delivery, shipping_cost, timestamps | Defined |
| `complaints` | id, customer_name, customer_email, subject, message, status, timestamps | Defined |

### Indexes
- `idx_products_slug` on `products(slug)`
- `idx_products_category_id` on `products(category_id)`
- `idx_orders_user_id` on `orders(user_id)`
- `idx_orders_status` on `orders(status)`
- `idx_product_variants_sku` on `product_variants(sku)`
- `idx_order_status_history_order_id` on `order_status_history(order_id)`
- `idx_complaints_status` on `complaints(status)`

### Seed Data
- Admin: `admin@dentalkart.com` / `admin123`
- Customers: John Doe, Jane Smith, Raj Patel
- Categories: Implant Prosthetics, Airotors, Composite
- Products: 3 sample products
- Orders: 2 sample orders with history
- Complaints: 3 sample complaints

---

## 8. Recommended Implementation Roadmap

### Phase 1 — Critical Fixes (Week 1)
1. Fix `setup.ts` — reorder table creation, add `products`/`categories` seed data, add `.env.example`
2. Fix admin auth — protect category routes with `adminAuth`
3. Add customer backend auth — registration, login, JWT tokens
4. Fix README — correct credentials, setup instructions

### Phase 2 — Core Customer Features (Weeks 2-3)
1. Real customer authentication (register, login, logout, password reset)
2. Address management (CRUD addresses, set default)
3. Product image upload (local storage or S3)
4. Product reviews and ratings
5. Wishlist functionality
6. Coupon/promo code system

### Phase 3 — Payments & Shipping (Weeks 4-5)
1. Razorpay integration (UPI, cards, netbanking)
2. Payment webhook handling
3. Order confirmation emails
4. Shipping address validation
5. Shipment tracking integration (Shiprocket API or manual)

### Phase 4 — Admin Enhancements (Week 6)
1. Inventory management page
2. Analytics dashboard with charts
3. Coupon management
4. Review moderation
5. Settings page (store info, shipping rules)
6. Bulk product import/export

### Phase 5 — Polish & Scale (Week 7+)
1. Staff/sub-admin roles with scoped permissions
2. Return/refund flow
3. Email notifications (order confirmations, status updates)
4. Product search optimization (PostgreSQL full-text search)
5. Pagination on all list endpoints
6. Rate limiting and security hardening
7. Docker containerization
8. CI/CD pipeline
9. API documentation (Swagger)

---

## 9. Immediate Action Items

### High Priority
1. **Fix `backend/src/db/setup.ts`** — The `admins` table creation must happen before any INSERT into it. Add all missing DROP TABLE statements.
2. **Create `.env.example`** — Document all required environment variables.
3. **Fix category routes** — Add `adminAuth` middleware to `POST/PUT/DELETE /api/categories`.
4. **Add customer auth endpoints** — Register, login, logout, profile.
5. **Update README** — Correct credentials, setup steps, API docs.

### Medium Priority
6. Add product image upload endpoint
7. Implement coupon validation at checkout
8. Add order cancellation flow
9. Create inventory management admin page
10. Add email service for order confirmations

### Low Priority
11. Add Docker setup
12. Add tests
13. Add CI/CD
14. Add analytics charts to dashboard

---

## 10. File Inventory

### Backend
| File | Purpose | Status |
|------|---------|--------|
| `backend/src/server.ts` | Express app, route mounts | Complete |
| `backend/src/db.ts` | PostgreSQL connection | Complete |
| `backend/src/db/setup.ts` | Database schema + seed | Needs fix |
| `backend/src/middleware/adminAuth.ts` | JWT auth for admin | Complete |
| `backend/src/controllers/admin.controller.ts` | Admin auth | Complete |
| `backend/src/controllers/product.controller.ts` | Product CRUD | Complete |
| `backend/src/controllers/category.controller.ts` | Category CRUD | Complete |
| `backend/src/controllers/customer.controller.ts` | Customer CRUD | Complete |
| `backend/src/controllers/order.controller.ts` | Order management | Complete |
| `backend/src/controllers/complaint.controller.ts` | Complaint management | Complete |
| `backend/src/routes/*.ts` | Route definitions | Complete |

### Frontend Customer
| File | Purpose | Status |
|------|---------|--------|
| `web/src/App.tsx` | Routes, app shell | Complete |
| `web/src/customer/pages/HomePage.tsx` | Product listing with filters | Complete |
| `web/src/customer/pages/ProductDetailPage.tsx` | Product detail | Complete |
| `web/src/customer/pages/CartPage.tsx` | Shopping cart | Complete |
| `web/src/customer/pages/LoginPage.tsx` | Mock login | Needs real auth |
| `web/src/customer/pages/SignupPage.tsx` | Mock signup | Needs real auth |
| `web/src/customer/pages/AddressPage.tsx` | Hardcoded address | Needs CRUD |
| `web/src/customer/pages/PaymentPage.tsx` | Mock payment | Needs Razorpay |
| `web/src/customer/pages/OrdersPage.tsx` | Order history | Complete |
| `web/src/customer/pages/OrderDetailPage.tsx` | Order tracking | Complete |
| `web/src/customer/pages/SupportPage.tsx` | Complaint form | Complete |
| `web/src/customer/components/Header.tsx` | Navigation header | Complete |
| `web/src/customer/components/ProductCard.tsx` | Product card | Complete |
| `web/src/customer/context/CartContext.tsx` | Cart state | Complete |
| `web/src/customer/api/customerApi.ts` | Customer API client | Complete |
| `web/src/customer/types/index.ts` | TypeScript types | Complete |

### Frontend Admin
| File | Purpose | Status |
|------|---------|--------|
| `web/src/admin/pages/AdminLoginPage.tsx` | Admin login | Complete |
| `web/src/admin/pages/AdminDashboardPage.tsx` | Dashboard with stats | Complete |
| `web/src/admin/pages/AdminProductsPage.tsx` | Product CRUD | Complete |
| `web/src/admin/pages/AdminCategoriesPage.tsx` | Category CRUD | Complete |
| `web/src/admin/pages/AdminOrdersPage.tsx` | Order management | Complete |
| `web/src/admin/pages/AdminCustomersPage.tsx` | Customer management | Complete |
| `web/src/admin/pages/AdminComplaintsPage.tsx` | Complaint management | Complete |
| `web/src/admin/api/adminApi.ts` | Admin API client with JWT | Complete |

---

*This document reflects the actual state of the codebase as of 2026-08-29 and should be used as the source of truth for all future development.*
