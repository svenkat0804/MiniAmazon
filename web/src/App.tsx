import { useState } from "react"

import { CartProvider } from "./customer/context/CartContext.tsx"

import Header from "./customer/components/Header"
import Footer from "./customer/components/Footer"
import CartToast from "./customer/components/CartToast"

import { BrowserRouter, Routes, Route } from "react-router-dom"

import HomePage from "./customer/pages/HomePage"
import CartPage from "./customer/pages/CartPage"
import LoginPage from "./customer/pages/LoginPage"
import ProductDetailPage from "./customer/pages/ProductDetailPage"
import SignupPage from "./customer/pages/SignupPage"

import AdminLoginPage from "./admin/pages/AdminLoginPage"
import AdminDashboardPage from "./admin/pages/AdminDashboardPage"

import "./App.css"


type Page =
  | "home"
  | "cart"
  | "login"
  | "address"
  | "signup"
  | "product-detail"


function App() {

  const isAdminLogin =
  window.location.pathname === "/admin/login"

  const isAdminDashboard =
    window.location.pathname === "/admin/dashboard"

  if (isAdminLogin) {
    return (
      <AdminLoginPage
        onLoginSuccess={() => {
          window.location.href =
            "/admin/dashboard"
        }}
      />
    )
  }

  if (isAdminDashboard) {
    return (
      <AdminDashboardPage
        onLogout={() => {
          window.location.href =
            "/admin/login"
        }}
      />
    )
  }

  // your existing code continues here...

  // --------------------------------
  // Search
  // --------------------------------

  const [searchText, setSearchText] =
    useState("")


  // --------------------------------
  // Current Page
  // --------------------------------

  const [currentPage, setCurrentPage] =
    useState<Page>("home")


  // --------------------------------
  // Selected Product
  // --------------------------------

  const [selectedProductId, setSelectedProductId] =
    useState<number | null>(null)


  // --------------------------------
  // Cart Toast
  // --------------------------------

  const [toastProduct, setToastProduct] =
    useState<string | null>(null)


  // --------------------------------
  // Home
  // --------------------------------

  const openHome = () => {

    setCurrentPage("home")

  }
 
  const openSignup = () => {
    setCurrentPage("signup")
  }

  // --------------------------------
  // Cart
  // --------------------------------

  const openCart = () => {

    setCurrentPage("cart")

  }


  // --------------------------------
  // Login
  // --------------------------------

  const openLogin = () => {

    setCurrentPage("login")

  }


  // --------------------------------
  // Product Detail
  // --------------------------------

  const openProductDetail = (
    productId: number
  ) => {

    setSelectedProductId(productId)

    setCurrentPage("product-detail")

  }


  // --------------------------------
  // Show Cart Toast
  // --------------------------------

  const showCartToast = (
    productName: string
  ) => {

    setToastProduct(productName)

    // Remove toast automatically
    // after 4 seconds

    setTimeout(() => {

      setToastProduct(null)

    }, 4000)

  }


  // --------------------------------
  // Checkout
  // --------------------------------

  const handleCheckout = () => {

    const user =
      localStorage.getItem(
        "mini-amazon-user"
      )


    if (user) {

      setCurrentPage("address")

    } else {

      setCurrentPage("login")

    }

  }


  // --------------------------------
  // Login Success
  // --------------------------------

  const handleLoginSuccess = () => {

    setCurrentPage("address")

  }


  return (

    <CartProvider>

      <div className="app">


        {/* =========================
            HEADER
        ========================= */}

        {currentPage !== "login" && currentPage !== "signup" && (

          <Header
            searchText={searchText}
            onSearchChange={setSearchText}
            onCartClick={openCart}
            onLoginClick={openLogin}
          />

        )}


        {/* =========================
            CONTENT
        ========================= */}

        <main className="content-area">


          {/* HOME */}

          {currentPage === "home" && (

            <HomePage
              searchText={searchText}

              onProductAdded={
                showCartToast
              }

              onViewProduct={
                openProductDetail
              }
            />

          )}


          {/* CART */}

          {currentPage === "cart" && (

            <CartPage
              onContinueShopping={
                openHome
              }

              onCheckout={
                handleCheckout
              }
            />

          )}


          {/* LOGIN */}

          {currentPage === "login" && (

            <LoginPage
              onLoginSuccess={handleLoginSuccess}
              onSignupClick={openSignup}
            />

          )}

          {/* SIGNUP */}

          {currentPage === "signup" && (
            <SignupPage
              onSignupSuccess={() => {
                setCurrentPage("home")
              }}
              onLoginClick={openLogin}
            />
          )}

          {/* PRODUCT DETAIL */}

          {currentPage === "product-detail" &&
            selectedProductId !== null && (

              <ProductDetailPage
                productId={
                  selectedProductId
                }

                onBack={
                  openHome
                }

                onAdded={
                  showCartToast
                }
              />

          )}
 
          {/* ADDRESS */}

          {currentPage === "address" && (

            <div className="address-test-page">

              <h1>
                Delivery Address
              </h1>

              <p>
                Address page is working.
              </p>


              <button
                type="button"
                onClick={openCart}
              >
                Back to Cart
              </button>

            </div>

          )}

        </main>


        {/* =========================
            CART TOAST
        ========================= */}

        {toastProduct && (

          <CartToast
            productName={
              toastProduct
            }

            onViewCart={() => {

              setToastProduct(null)

              setCurrentPage("cart")

            }}

            onClose={() => {

              setToastProduct(null)

            }}
          />

        )}


        {/* =========================
            FOOTER
        ========================= */}

        <Footer />

      </div>

    </CartProvider>
  )
}


export default App