import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import {
  getBackendOrders,
  getOrders
} from "../utils/orders"
import type { Order } from "../types"

type TabType = "live" | "past"

const LIVE_STATUSES = ["PLACED", "CONFIRMED", "SHIPPED", "OUT_FOR_DELIVERY"] as const

function OrdersPage() {

  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>("live")
  const [useBackend, setUseBackend] = useState(true)

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true)
      try {
        if (useBackend) {
          const backendOrders = await getBackendOrders()
          setOrders(backendOrders)
        } else {
          setOrders(getOrders())
        }
      } catch (error) {
        console.error("Error loading orders:", error)
        setOrders(getOrders())
        setUseBackend(false)
      } finally {
        setLoading(false)
      }
    }

    loadOrders()
  }, [useBackend])

  const liveOrders = orders.filter(order => LIVE_STATUSES.includes(order.orderStatus as typeof LIVE_STATUSES[number]))
  const pastOrders = orders.filter(order => order.orderStatus === "DELIVERED")
  const displayOrders = activeTab === "live" ? liveOrders : pastOrders

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
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

  return (
    <main className="page-content">

      <h1>
        My Orders
      </h1>

      {!useBackend && (
        <div style={styles.notice}>
          Using local orders. Backend connection unavailable.
        </div>
      )}

      {loading ? (
        <div className="empty-message">
          <p>
            Loading orders...
          </p>
        </div>
      ) : orders.length === 0 ? (
        <div className="empty-message">

          <p>
            No orders found.
          </p>

          <Link
            to="/"
            className="primary-button"
          >
            Start Shopping
          </Link>

        </div>

      ) : (

        <div className="orders-page">

          <div className="orders-tabs">

            <button
              type="button"
              className={`orders-tab ${activeTab === "live" ? "active" : ""}`}
              onClick={() => setActiveTab("live")}
            >
              📦 Live Orders
              {liveOrders.length > 0 && (
                <span className="tab-badge">{liveOrders.length}</span>
              )}
            </button>

            <button
              type="button"
              className={`orders-tab ${activeTab === "past" ? "active" : ""}`}
              onClick={() => setActiveTab("past")}
            >
              ✅ Past Orders
              {pastOrders.length > 0 && (
                <span className="tab-badge">{pastOrders.length}</span>
              )}
            </button>

          </div>

          {displayOrders.length === 0 ? (

            <div className="empty-message">

              <p>
                {activeTab === "live"
                  ? "No live orders found."
                  : "No past orders found."}
              </p>

            </div>

          ) : (

            <div className="orders-list">

              {displayOrders.map(order => (

                <div
                  className="order-card"
                  key={order.id}
                  onClick={() => navigate(`/orders/${order.id}`)}
                >

                  <div className="order-header">

                    <div className="order-id-section">

                      <h2>
                        {order.id}
                      </h2>

                      <span className="order-date">
                        {formatDate(order.createdAt)}
                      </span>

                    </div>

                    <span className={`order-status ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus.replace(/_/g, " ")}
                    </span>

                  </div>

                  <div className="order-items-preview">

                    {order.items.slice(0, 2).map(item => (

                      <div
                        className="order-item"
                        key={item.id}
                      >

                        <span className="item-name">
                          {item.name}
                        </span>

                        <span className="item-qty">
                          × {item.quantity}
                        </span>

                      </div>

                    ))}

                    {order.items.length > 2 && (
                      <p className="more-items">
                        +{order.items.length - 2} more items
                      </p>
                    )}

                  </div>

                  <div className="order-footer">

                    <div className="order-payment">

                      <span>💳 {order.paymentMethod}</span>

                      <span className="order-total">
                        ₹{Number(order.total).toLocaleString("en-IN")}
                      </span>

                    </div>

                    <button
                      type="button"
                      className="view-order-button"
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/orders/${order.id}`)
                      }}
                    >
                      View Details
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      )}

    </main>
  )
}

const styles = {
  notice: {
    padding: "12px 16px",
    marginBottom: "20px",
    borderRadius: "7px",
    backgroundColor: "#fff3e0",
    color: "#e65100",
    border: "1px solid #ffe0b2",
    fontSize: "14px"
  }
}

export default OrdersPage
