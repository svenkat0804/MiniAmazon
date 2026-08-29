import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"

import {
  getOrderById,
  getBackendOrders
} from "../utils/orders"
import type { CartItem, Address, TrackingInfo } from "../types"

const TRACKING_STEPS = [
  { status: "PLACED", label: "Order Placed", description: "Your order has been placed successfully" },
  { status: "CONFIRMED", label: "Confirmed", description: "Seller has confirmed your order" },
  { status: "SHIPPED", label: "Shipped", description: "Your order has been shipped" },
  { status: "OUT_FOR_DELIVERY", label: "Out for Delivery", description: "Your order is out for delivery" },
  { status: "DELIVERED", label: "Delivered", description: "Your order has been delivered" }
] as const

type Order = {
  id: string
  items: CartItem[]
  address: Address
  paymentMethod: string
  paymentStatus: string
  orderStatus: string
  total: number
  createdAt: string
  tracking?: TrackingInfo
}

function OrderDetailPage() {

  const { orderId } = useParams<{ orderId: string }>()
  const [order, setOrder] = useState<Order | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadOrder = async () => {
      if (!orderId) {
        setLoading(false)
        return
      }

      setLoading(true)

      let foundOrder = getOrderById(orderId)

      if (!foundOrder && /^\d+$/.test(orderId)) {
        try {
          const backendOrders = await getBackendOrders()
          foundOrder = backendOrders.find(o => String(o.id) === orderId)
        } catch (error) {
          console.error("Error fetching order from backend:", error)
        }
      }

      setOrder(foundOrder)
      setLoading(false)
    }

    loadOrder()
  }, [orderId])

  if (loading) {
    return (
      <main className="page-content">
        <div className="empty-message">
          <p>
            Loading order details...
          </p>
        </div>
      </main>
    )
  }

  if (!order) {
    return (
      <main className="page-content">

        <div className="empty-message">

          <h1>Order Not Found</h1>

          <p>
            The order you're looking for doesn't exist or has been removed.
          </p>

          <Link
            to="/orders"
            className="primary-button"
          >
            Back to Orders
          </Link>

        </div>

      </main>
    )
  }

  const currentStatusIndex = TRACKING_STEPS.findIndex(step => step.status === order.orderStatus)
  const subtotal = order.total
  const shipping = subtotal > 999 ? 0 : 99
  const finalTotal = subtotal + shipping

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PLACED":
        return "status-placed"
      case "CONFIRMED":
        return "status-confirmed"
      case "SHIPPED":
        return "status-shipped"
      case "OUT_FOR_DELIVERY":
        return "status-out-for-delivery"
      case "DELIVERED":
        return "status-delivered"
      default:
        return "status-placed"
    }
  }

  const orderStatus = order.orderStatus
  const paymentMethod = order.paymentMethod
  const paymentStatus = order.paymentStatus
  const createdAt = order.createdAt

  return (
    <main className="page-content">

      <div className="order-detail-container">

        <div className="order-detail-header">

          <div className="order-detail-title">

            <h1>
              Order Details
            </h1>

            <span className={`order-status ${getStatusColor(orderStatus)}`}>
              {orderStatus.replace(/_/g, " ")}
            </span>

          </div>

          <Link
            to="/orders"
            className="back-button"
          >
            ← Back to Orders
          </Link>

        </div>

        {/* Tracking Timeline */}

        <div className="tracking-section">

          <h2>
            📍 Order Tracking
          </h2>

          <div className="tracking-timeline">

            {TRACKING_STEPS.map((step, index) => {

              const isCompleted = index < currentStatusIndex
              const isActive = index === currentStatusIndex
              const isLast = index === TRACKING_STEPS.length - 1

              return (
                <div
                  className={`tracking-step ${isCompleted ? "completed" : ""} ${isActive ? "active" : ""}`}
                  key={step.status}
                >

                  <div className="tracking-icon">

                    {isCompleted ? "✓" : isActive ? "●" : "○"}

                  </div>

                  {!isLast && (
                    <div className={`tracking-line ${isCompleted ? "completed" : ""}`} />
                  )}

                  <div className="tracking-content">

                    <h3>
                      {step.label}
                    </h3>

                    <p>
                      {isCompleted || isActive ? step.description : "Pending"}
                    </p>

                  </div>

                </div>
              )

            })}

          </div>

        </div>

        {/* Order Info */}

        <div className="order-info-section">

          <h2>
            📋 Order Information
          </h2>

          <div className="order-info-grid">

            <div className="info-item">

              <span className="info-label">
                Order ID
              </span>

              <span className="info-value">
                {order.id}
              </span>

            </div>

            <div className="info-item">

              <span className="info-label">
                Order Date
              </span>

              <span className="info-value">
                {formatDate(createdAt)}
              </span>

            </div>

            <div className="info-item">

              <span className="info-label">
                Payment Method
              </span>

              <span className="info-value">
                {paymentMethod}
              </span>

            </div>

            <div className="info-item">

              <span className="info-label">
                Payment Status
              </span>

              <span className={`info-value payment-${paymentStatus.toLowerCase()}`}>
                {paymentStatus}
              </span>

            </div>

          </div>

        </div>

        {/* Product List */}

        <div className="products-section">

          <h2>
            🛒 Products
          </h2>

          <div className="order-products-list">

            {order.items.map(item => (

              <div
                className="order-product-item"
                key={item.id}
              >

                <div className="product-image-placeholder">
                  📦
                </div>

                <div className="product-details">

                  <h3>
                    {item.name}
                  </h3>

                  <p className="product-price">
                    ₹{item.price.toLocaleString("en-IN")} × {item.quantity}
                  </p>

                </div>

                <div className="product-total">
                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                </div>

              </div>

            ))}

          </div>

        </div>

        {/* Delivery Address */}

        <div className="address-section">

          <h2>
            📍 Delivery Address
          </h2>

          <div className="address-card">

            <h3>
              {order.address.name}
            </h3>

            <p>
              📞 {order.address.phone}
            </p>

            <p>
              {order.address.addressLine}<br />
              {order.address.city}, {order.address.state} - {order.address.pincode}
            </p>

          </div>

        </div>

        {/* Invoice Summary */}

        <div className="invoice-section">

          <h2>
            💰 Invoice Summary
          </h2>

          <div className="invoice-card">

            <div className="invoice-row">

              <span>
                Subtotal
              </span>

              <span>
                ₹{subtotal.toLocaleString("en-IN")}
              </span>

            </div>

            <div className="invoice-row">

              <span>
                Shipping
              </span>

              <span>
                {shipping === 0 ? "FREE" : `₹${shipping}`}
              </span>

            </div>

            <hr />

            <div className="invoice-row total">

              <span>
                Total
              </span>

              <span>
                ₹{finalTotal.toLocaleString("en-IN")}
              </span>

            </div>

          </div>

        </div>

        {/* Support Note */}

        <div className="support-note">

          <p>
            💬 For any queries about this order, please contact our support team.
          </p>

          <Link
            to="/support"
            className="primary-button"
          >
            Contact Support
          </Link>

        </div>

      </div>

    </main>
  )
}

export default OrderDetailPage
