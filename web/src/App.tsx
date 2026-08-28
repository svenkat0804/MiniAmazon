import { useState } from "react"

import { CartProvider, useCart } from "./customer/context/CartContext.tsx"

import Header from "./customer/components/Header"
import Footer from "./customer/components/Footer"
import CartToast from "./customer/components/CartToast"

import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation, useParams } from "react-router-dom"

import HomePage from "./customer/pages/HomePage"
import CartPage from "./customer/pages/CartPage"
import LoginPage from "./customer/pages/LoginPage"
import ProductDetailPage from "./customer/pages/ProductDetailPage"
import SignupPage from "./customer/pages/SignupPage"
import OrdersPage from "./customer/pages/OrdersPage"

import AdminLoginPage from "./admin/pages/AdminLoginPage"
import AdminDashboardPage from "./admin/pages/AdminDashboardPage"

import { saveOrder } from "./customer/utils/orders"

import "./App.css"


function CustomerApp() {

  const navigate = useNavigate()
  const location = useLocation()
  const { cart } = useCart()

  const [searchText, setSearchText] = useState("")
  const [toastProduct, setToastProduct] = useState<string | null>(null)

  const showCartToast = (productName: string) => {
    setToastProduct(productName)
    setTimeout(() => setToastProduct(null), 4000)
  }

  return (

    <div className="app">

      {location.pathname !== "/login" && location.pathname !== "/signup" && (

        <Header
          searchText={searchText}
          onSearchChange={setSearchText}
          onCartClick={() => navigate("/cart")}
          onLoginClick={() => navigate("/login")}
          cartCount={
            cart.reduce(
              (sum, item) => sum + item.quantity,
              0
            )
          }
        />

      )}


      <main className="content-area">

        <Routes>

          <Route
            path="/"
            element={
              <HomePage
                searchText={searchText}
                onProductAdded={showCartToast}
                onViewProduct={(productId) => navigate(`/product/${productId}`)}
              />
            }
          />

          <Route
            path="/cart"
            element={
              <CartPage
                onContinueShopping={() => navigate("/")}
                onCheckout={() => {
                  const user = localStorage.getItem("mini-amazon-user")
                  if (user) {
                    navigate("/address")
                  } else {
                    navigate("/login")
                  }
                }}
              />
            }
          />

          <Route
            path="/login"
            element={
              <LoginPage
                onLoginSuccess={() => navigate("/address")}
                onSignupClick={() => navigate("/signup")}
              />
            }
          />

          <Route
            path="/signup"
            element={
              <SignupPage
                onSignupSuccess={() => navigate("/")}
                onLoginClick={() => navigate("/login")}
              />
            }
          />

          <Route
            path="/product/:productId"
            element={
              <ProductDetailPageWrapper
                onAdded={showCartToast}
              />
            }
          />

          <Route
            path="/address"
            element={<AddressPageWrapper />}
          />

          <Route
            path="/payment"
            element={<PaymentPageWrapper />}
          />

          <Route
            path="/orders"
            element={<OrdersPage />}
          />

          <Route
            path="/order-success/:orderId"
            element={<OrderSuccessPageWrapper />}
          />

        </Routes>

      </main>


      {toastProduct && (

        <CartToast
          productName={toastProduct}
          onViewCart={() => {
            setToastProduct(null)
            navigate("/cart")
          }}
          onClose={() => setToastProduct(null)}
        />

      )}


      <Footer />

    </div>

  )
}


function ProductDetailPageWrapper({
  onAdded
}: {
  onAdded: (productName: string) => void
}) {

  const navigate = useNavigate()
  const params = useParams()

  const productId = Number(params.productId)

  return (
    <ProductDetailPage
      productId={productId}
      onBack={() => navigate("/")}
      onAdded={onAdded}
    />
  )
}


function AddressPageWrapper() {

  const navigate = useNavigate()

  const defaultAddress = {
    id: 1,
    name: "Venkatesh",
    phone: "9876543210",
    addressLine: "10, Main Road",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600001",
    isDefault: true
  }

  const handleContinue = () => {
    localStorage.setItem("selectedAddress", JSON.stringify(defaultAddress))
    navigate("/payment")
  }

  return (
    <main className="page-content">
      <h1>Delivery Address</h1>
      <div className="address-card">
        <span className="default-badge">Default Address</span>
        <h2>{defaultAddress.name}</h2>
        <p>Phone: {defaultAddress.phone}</p>
        <p>
          {defaultAddress.addressLine}<br />
          {defaultAddress.city}<br />
          {defaultAddress.state}<br />
          {defaultAddress.pincode}
        </p>
        <button className="primary-button" onClick={handleContinue}>
          Use This Address
        </button>
      </div>
    </main>
  )
}


function PaymentPageWrapper() {

  const navigate = useNavigate()
  const { cart, cartTotal, clearCart } = useCart()
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "UPI" | "CREDIT_CARD" | "DEBIT_CARD">("COD")
  const [processing, setProcessing] = useState(false)

  const addressData = localStorage.getItem("selectedAddress")
  const address = addressData ? JSON.parse(addressData) : null

  const confirmOrder = async () => {
    if (!address) {
      navigate("/address")
      return
    }

    if (cart.length === 0) {
      navigate("/cart")
      return
    }

    setProcessing(true)

    if (paymentMethod === "COD") {
      const order = {
        id: `ORD-${Date.now()}`,
        items: cart,
        address,
        paymentMethod,
        paymentStatus: "SUCCESS" as const,
        orderStatus: "PLACED" as const,
        total: cartTotal,
        createdAt: new Date().toISOString()
      }
      saveOrder(order)
      clearCart()
      setProcessing(false)
      navigate(`/order-success/${order.id}`)
      return
    }

    await new Promise(resolve => setTimeout(resolve, 2000))

    const paymentSuccess = Math.random() > 0.3

    if (!paymentSuccess) {
      setProcessing(false)
      alert("Payment failed. Your cart has not been cleared.")
      return
    }

    const order = {
      id: `ORD-${Date.now()}`,
      items: cart,
      address,
      paymentMethod,
      paymentStatus: "SUCCESS" as const,
      orderStatus: "PLACED" as const,
      total: cartTotal,
      createdAt: new Date().toISOString()
    }

    saveOrder(order)
    clearCart()
    setProcessing(false)
    navigate(`/order-success/${order.id}`)
  }

  return (
    <main className="page-content">
      <h1>Payment</h1>
      {address && (
        <div className="checkout-section">
          <h2>Delivery Address</h2>
          <p><strong>{address.name}</strong></p>
          <p>
            {address.addressLine}, {address.city}, {address.state} - {address.pincode}
          </p>
        </div>
      )}
      <div className="checkout-section">
        <h2>Select Payment Method</h2>
        <label className="payment-option">
          <input
            type="radio"
            name="payment"
            checked={paymentMethod === "COD"}
            onChange={() => setPaymentMethod("COD")}
          />
          Cash on Delivery
        </label>
        <label className="payment-option">
          <input
            type="radio"
            name="payment"
            checked={paymentMethod === "UPI"}
            onChange={() => setPaymentMethod("UPI")}
          />
          UPI
        </label>
        <label className="payment-option">
          <input
            type="radio"
            name="payment"
            checked={paymentMethod === "CREDIT_CARD"}
            onChange={() => setPaymentMethod("CREDIT_CARD")}
          />
          Credit Card
        </label>
        <label className="payment-option">
          <input
            type="radio"
            name="payment"
            checked={paymentMethod === "DEBIT_CARD"}
            onChange={() => setPaymentMethod("DEBIT_CARD")}
          />
          Debit Card
        </label>
      </div>
      <div className="checkout-total">
        <h2>Total: ₹{cartTotal.toLocaleString("en-IN")}</h2>
        <button className="primary-button" disabled={processing} onClick={confirmOrder}>
          {processing ? "Processing..." : "Confirm Order"}
        </button>
      </div>
    </main>
  )
}


function OrderSuccessPageWrapper() {

  const { orderId } = useParams()

  return (
    <main className="page-content">
      <div className="success-card">
        <div className="success-icon">✓</div>
        <h1>Order Placed Successfully</h1>
        <p>Thank you for your order.</p>
        <p>Order ID: <strong>{orderId}</strong></p>
        <div className="success-actions">
          <Link to="/orders" className="primary-button">View Orders</Link>
          <Link to="/" className="secondary-button">Continue Shopping</Link>
        </div>
      </div>
    </main>
  )
}


function App() {

  const isAdminLogin = window.location.pathname === "/admin/login"
  const isAdminDashboard = window.location.pathname === "/admin/dashboard"

  if (isAdminLogin) {
    return (
      <AdminLoginPage
        onLoginSuccess={() => {
          window.location.href = "/admin/dashboard"
        }}
      />
    )
  }

  if (isAdminDashboard) {
    return (
      <AdminDashboardPage
        onLogout={() => {
          window.location.href = "/admin/login"
        }}
      />
    )
  }

  return (
    <CartProvider>
      <BrowserRouter>
        <CustomerApp />
      </BrowserRouter>
    </CartProvider>
  )
}

export default App
