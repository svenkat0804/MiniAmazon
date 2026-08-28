# DentalKart - Dental Ecommerce Store

A modern dental products ecommerce platform inspired by Dentalkart. Built with React, TypeScript, and Vite for the frontend, and Node.js with Express and PostgreSQL for the backend.

## 🦷 About

DentalKart is an online dental store offering 20,000+ dental products from 450+ trusted brands. The platform provides a complete shopping experience with product browsing, cart management, address selection, and order placement.

## ✨ Features

- **Customer-facing storefront** with hero banner, categories, and product grid
- **Product browsing** with search and category filtering
- **Shopping cart** with quantity controls and order summary
- **Checkout flow** covering address, payment method, and order confirmation
- **Order history** and order success tracking
- **Admin panel** for product and order management
- **Responsive design** optimized for desktop, tablet, and mobile
- **Dental-themed UI** with modern look and feel

## 🛠️ Tech Stack

### Frontend
- React 19 + TypeScript
- Vite
- React Router
- Context API for cart state

### Backend
- Node.js + Express
- TypeScript
- PostgreSQL
- JWT Authentication

## 📁 Project Structure

```
MiniAmazon/
├── backend/                 # Express API server
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── db.ts            # Database connection
│   │   └── server.ts        # App entry point
│   └── package.json
├── web/                     # React frontend
│   ├── src/
│   │   ├── customer/        # Customer pages and components
│   │   ├── admin/           # Admin pages and components
│   │   ├── App.tsx          # Root component
│   │   └── main.tsx         # Frontend entry point
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

The backend server runs at `http://localhost:5001`

### Frontend Setup

```bash
cd web
npm install
npm run dev
```

The frontend runs at `http://localhost:5173`

## 🔑 Default Credentials

### Customer
- Email: `customer@example.com`
- Password: `password`

### Admin
- Email: `admin@example.com`
- Password: `password`

## 📝 Available Scripts

### Backend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server

### Frontend
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 📄 License

MIT
