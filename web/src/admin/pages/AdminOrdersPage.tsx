import { useEffect, useState } from "react"
import type { FormEvent } from "react"

import {
  adminGet,
  adminPut
} from "../api/adminApi"

type Order = {
  id: number
  customer_id: number | null
  customer_name: string
  customer_email: string
  customer_phone: string | null
  shipping_address: string | null
  shipping_city: string | null
  shipping_state: string | null
  shipping_pincode: string | null
  items: unknown[]
  subtotal: number
  shipping_cost: number
  total: number
  payment_method: string
  payment_status: string
  order_status: string
  created_at: string
  updated_at: string
}

type HistoryItem = {
  id: number
  order_id: number
  status: string
  note: string | null
  created_at: string
}

const ORDER_STATUSES = [
  "PLACED",
  "CONFIRMED",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED"
] as const

const PAYMENT_STATUSES = [
  "SUCCESS",
  "FAILED",
  "PENDING",
  "REFUNDED"
] as const

function AdminOrdersPage() {

  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [statusFilter, setStatusFilter] = useState("")
  const [paymentFilter, setPaymentFilter] = useState("")

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [orderHistory, setOrderHistory] = useState<HistoryItem[]>([])
  const [showDetail, setShowDetail] = useState(false)

  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [updatingPayment, setUpdatingPayment] = useState(false)

  const [newStatus, setNewStatus] = useState("")
  const [newPaymentStatus, setNewPaymentStatus] = useState("")
  const [statusNote, setStatusNote] = useState("")


  const loadOrders = async () => {
    try {
      setLoading(true)
      setError("")

      const params = new URLSearchParams()
      if (statusFilter) params.append("status", statusFilter)
      if (paymentFilter) params.append("payment_status", paymentFilter)

      const data = await adminGet(`/admin/orders?${params.toString()}`) as { orders: Order[] }
      setOrders(data.orders || [])

    } catch (error) {

      console.error("Load orders error:", error)

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load orders"
      )

    } finally {
      setLoading(false)
    }
  }


  // eslint-disable react-hooks/exhaustive-deps
  useEffect(() => {
    loadOrders()
  }, [])
  // eslint-enable react-hooks/exhaustive-deps


  const handleViewDetails = async (order: Order) => {
    try {
      setSelectedOrder(order)
      setShowDetail(true)
      setNewStatus(order.order_status)
      setNewPaymentStatus(order.payment_status)
      setStatusNote("")

      const data = await adminGet(`/admin/orders/${order.id}`) as { order: Order; history: { id: number; order_id: number; status: string; note: string | null; created_at: string }[] }
      setOrderHistory(data.history || [])

    } catch (error) {

      console.error("Load order detail error:", error)

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load order details"
      )

    }
  }


  const handleCloseDetail = () => {
    setShowDetail(false)
    setSelectedOrder(null)
    setOrderHistory([])
    setNewStatus("")
    setNewPaymentStatus("")
    setStatusNote("")
  }


  const handleUpdateStatus = async (e: FormEvent) => {
    e.preventDefault()

    if (!selectedOrder || !newStatus) return

    try {
      setUpdatingStatus(true)
      setError("")

      await adminPut(`/admin/orders/${selectedOrder.id}/status`, {
        status: newStatus,
        note: statusNote || undefined
      })

      await loadOrders()

      const data = await adminGet(`/admin/orders/${selectedOrder.id}`) as { order: Order; history: { id: number; order_id: number; status: string; note: string | null; created_at: string }[] }
      setOrderHistory(data.history || [])

      setSelectedOrder({
        ...selectedOrder,
        order_status: newStatus
      })

    } catch (error) {

      console.error("Update status error:", error)

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update status"
      )

    } finally {
      setUpdatingStatus(false)
    }
  }


  const handleUpdatePayment = async (e: FormEvent) => {
    e.preventDefault()

    if (!selectedOrder || !newPaymentStatus) return

    try {
      setUpdatingPayment(true)
      setError("")

      await adminPut(`/admin/orders/${selectedOrder.id}/payment`, {
        payment_status: newPaymentStatus
      })

      await loadOrders()

      setSelectedOrder({
        ...selectedOrder,
        payment_status: newPaymentStatus
      })

    } catch (error) {

      console.error("Update payment error:", error)

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update payment status"
      )

    } finally {
      setUpdatingPayment(false)
    }
  }


  const formatCurrency = (amount: number) => {
    return `₹${Number(amount).toLocaleString("en-IN")}`
  }

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

  const getStatusStyle = (status: string) => {
    const colors: Record<string, { bg: string; color: string }> = {
      PLACED: { bg: "#e3f2fd", color: "#1565c0" },
      CONFIRMED: { bg: "#e8f5e9", color: "#2e7d32" },
      SHIPPED: { bg: "#fff3e0", color: "#e65100" },
      OUT_FOR_DELIVERY: { bg: "#f3e5f5", color: "#7b1fa2" },
      DELIVERED: { bg: "#e8f5e9", color: "#1b5e20" },
      CANCELLED: { bg: "#ffebee", color: "#c62828" },
      SUCCESS: { bg: "#e8f5e9", color: "#2e7d32" },
      FAILED: { bg: "#ffebee", color: "#c62828" },
      PENDING: { bg: "#fff3e0", color: "#e65100" },
      REFUNDED: { bg: "#f5f5f5", color: "#616161" }
    }

    const style = colors[status] || { bg: "#f5f5f5", color: "#616161" }

    return {
      display: "inline-block",
      padding: "5px 10px",
      borderRadius: "20px",
      backgroundColor: style.bg,
      color: style.color,
      fontSize: "12px",
      fontWeight: 600
    }
  }


  return (
    <div style={styles.page}>

      <div style={styles.header}>

        <div>

          <h1 style={styles.title}>
            Orders
          </h1>

          <p style={styles.subtitle}>
            Manage customer orders
          </p>

        </div>

      </div>

      {error && showDetail === false && (
        <div style={styles.error}>
          {error}
        </div>
      )}

      {showDetail && error && (
        <div style={styles.error}>
          {error}
        </div>
      )}

      <div style={styles.filters}>

        <div style={styles.filterGroup}>

          <label style={styles.label}>
            Order Status
          </label>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            style={styles.select}
          >

            <option value="">
              All Statuses
            </option>

            {ORDER_STATUSES.map((status) => (
              <option
                key={status}
                value={status}
              >
                {status.replace(/_/g, " ")}
              </option>
            ))}

          </select>

        </div>

        <div style={styles.filterGroup}>

          <label style={styles.label}>
            Payment Status
          </label>

          <select
            value={paymentFilter}
            onChange={(event) =>
              setPaymentFilter(event.target.value)
            }
            style={styles.select}
          >

            <option value="">
              All Payments
            </option>

            {PAYMENT_STATUSES.map((status) => (
              <option
                key={status}
                value={status}
              >
                {status}
              </option>
            ))}

          </select>

        </div>

        <button
          type="button"
          onClick={loadOrders}
          style={styles.applyButton}
        >
          Apply Filters
        </button>

      </div>

      <div style={styles.listCard}>

        <div style={styles.listHeader}>

          <div>

            <h2 style={styles.listTitle}>
              Order List
            </h2>

            <p style={styles.listSubtitle}>
              All orders
            </p>

          </div>

          <span style={styles.count}>
            {orders.length}
          </span>

        </div>

        {loading ? (
          <div style={styles.empty}>
            <p>
              Loading orders...
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div style={styles.empty}>
            <p>
              No orders found.
            </p>
          </div>
        ) : (
          <div style={styles.tableWrapper}>

            <table style={styles.table}>

              <thead>

                <tr>

                  <th style={styles.th}>
                    Order ID
                  </th>

                  <th style={styles.th}>
                    Customer
                  </th>

                  <th style={styles.th}>
                    Items
                  </th>

                  <th style={styles.th}>
                    Total
                  </th>

                  <th style={styles.th}>
                    Payment
                  </th>

                  <th style={styles.th}>
                    Status
                  </th>

                  <th style={styles.th}>
                    Date
                  </th>

                  <th style={styles.th}>
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {orders.map((order) => (
                  <tr key={order.id} style={styles.tr}>

                    <td style={styles.td}>
                      #{order.id}
                    </td>

                    <td style={styles.td}>

                      <div>

                        <strong>
                          {order.customer_name}
                        </strong>

                        <p style={styles.cellSub}>
                          {order.customer_email}
                        </p>

                      </div>

                    </td>

                    <td style={styles.td}>
                      {order.items?.length || 0} items
                    </td>

                    <td style={styles.td}>
                      {formatCurrency(order.total)}
                    </td>

                    <td style={styles.td}>

                      <span style={getStatusStyle(order.payment_status)}>
                        {order.payment_status}
                      </span>

                    </td>

                    <td style={styles.td}>

                      <span style={getStatusStyle(order.order_status)}>
                        {order.order_status.replace(/_/g, " ")}
                      </span>

                    </td>

                    <td style={styles.td}>
                      {formatDate(order.created_at)}
                    </td>

                    <td style={styles.td}>

                      <button
                        type="button"
                        onClick={() =>
                          handleViewDetails(order)
                        }
                        style={styles.viewButton}
                      >
                        View Details
                      </button>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {showDetail && selectedOrder && (
        <div style={styles.modalOverlay}>

          <div style={styles.modal}>

            <div style={styles.modalHeader}>

              <h2 style={styles.modalTitle}>
                Order #{selectedOrder.id}
              </h2>

              <button
                type="button"
                onClick={handleCloseDetail}
                style={styles.closeButton}
              >
                ×
              </button>

            </div>

            <div style={styles.modalBody}>

              <div style={styles.sectionGrid}>

                <div style={styles.detailSection}>

                  <h3 style={styles.detailTitle}>
                    Customer Information
                  </h3>

                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>
                      Name
                    </span>
                    <span style={styles.detailValue}>
                      {selectedOrder.customer_name}
                    </span>
                  </div>

                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>
                      Email
                    </span>
                    <span style={styles.detailValue}>
                      {selectedOrder.customer_email}
                    </span>
                  </div>

                  {selectedOrder.customer_phone && (
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>
                        Phone
                      </span>
                      <span style={styles.detailValue}>
                        {selectedOrder.customer_phone}
                      </span>
                    </div>
                  )}

                </div>

                <div style={styles.detailSection}>

                  <h3 style={styles.detailTitle}>
                    Shipping Address
                  </h3>

                  {selectedOrder.shipping_address ? (
                    <>
                      <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>
                          Address
                        </span>
                        <span style={styles.detailValue}>
                          {selectedOrder.shipping_address}
                        </span>
                      </div>

                      <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>
                          City
                        </span>
                        <span style={styles.detailValue}>
                          {selectedOrder.shipping_city}
                        </span>
                      </div>

                      <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>
                          State
                        </span>
                        <span style={styles.detailValue}>
                          {selectedOrder.shipping_state}
                        </span>
                      </div>

                      <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>
                          Pincode
                        </span>
                        <span style={styles.detailValue}>
                          {selectedOrder.shipping_pincode}
                        </span>
                      </div>
                    </>
                  ) : (
                    <p style={styles.noData}>
                      No shipping address
                    </p>
                  )}

                </div>

              </div>

              <div style={styles.detailSection}>

                <h3 style={styles.detailTitle}>
                  Order Items
                </h3>

                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                  <div style={styles.itemsList}>

                    {(selectedOrder.items as { name: string; price: number; quantity: number }[]).map((item, index) => (
                      <div key={index} style={styles.itemRow}>

                        <div style={styles.itemInfo}>
                          <strong>
                            {item.name}
                          </strong>
                          <p style={styles.itemPrice}>
                            {formatCurrency(item.price)} × {item.quantity}
                          </p>
                        </div>

                        <div style={styles.itemTotal}>
                          {formatCurrency(item.price * item.quantity)}
                        </div>

                      </div>
                    ))}

                  </div>
                ) : (
                  <p style={styles.noData}>
                    No items
                  </p>
                )}

                <div style={styles.invoiceSummary}>

                  <div style={styles.invoiceRow}>
                    <span>Subtotal</span>
                    <span>{formatCurrency(selectedOrder.subtotal)}</span>
                  </div>

                  <div style={styles.invoiceRow}>
                    <span>Shipping</span>
                    <span>
                      {selectedOrder.shipping_cost === 0
                        ? "FREE"
                        : formatCurrency(selectedOrder.shipping_cost)}
                    </span>
                  </div>

                  <hr style={styles.invoiceDivider} />

                  <div style={styles.invoiceRowTotal}>
                    <span>Total</span>
                    <span>{formatCurrency(selectedOrder.total)}</span>
                  </div>

                </div>

              </div>

              <div style={styles.detailSection}>

                <h3 style={styles.detailTitle}>
                  Payment Information
                </h3>

                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>
                    Method
                  </span>
                  <span style={styles.detailValue}>
                    {selectedOrder.payment_method}
                  </span>
                </div>

                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>
                    Status
                  </span>
                  <span style={getStatusStyle(selectedOrder.payment_status)}>
                    {selectedOrder.payment_status}
                  </span>
                </div>

              </div>

              <div style={styles.detailSection}>

                <h3 style={styles.detailTitle}>
                  Update Order Status
                </h3>

                <form onSubmit={handleUpdateStatus} style={styles.form}>

                  <div style={styles.formRow}>

                    <div style={styles.formGroup}>

                      <label style={styles.label}>
                        Status
                      </label>

                      <select
                        value={newStatus}
                        onChange={(event) =>
                          setNewStatus(event.target.value)
                        }
                        disabled={updatingStatus}
                        style={styles.select}
                      >

                        {ORDER_STATUSES.map((status) => (
                          <option
                            key={status}
                            value={status}
                          >
                            {status.replace(/_/g, " ")}
                          </option>
                        ))}

                      </select>

                    </div>

                    <div style={styles.formGroup}>

                      <label style={styles.label}>
                        Note
                      </label>

                      <input
                        type="text"
                        value={statusNote}
                        onChange={(event) =>
                          setStatusNote(event.target.value)
                        }
                        placeholder="Add a note (optional)"
                        disabled={updatingStatus}
                        style={styles.input}
                      />

                    </div>

                  </div>

                  <button
                    type="submit"
                    disabled={updatingStatus || newStatus === selectedOrder.order_status}
                    style={styles.updateButton}
                  >
                    {updatingStatus ? "Updating..." : "Update Status"}
                  </button>

                </form>

              </div>

              <div style={styles.detailSection}>

                <h3 style={styles.detailTitle}>
                  Update Payment Status
                </h3>

                <form onSubmit={handleUpdatePayment} style={styles.form}>

                  <div style={styles.formRow}>

                    <div style={styles.formGroup}>

                      <label style={styles.label}>
                        Payment Status
                      </label>

                      <select
                        value={newPaymentStatus}
                        onChange={(event) =>
                          setNewPaymentStatus(event.target.value)
                        }
                        disabled={updatingPayment}
                        style={styles.select}
                      >

                        {PAYMENT_STATUSES.map((status) => (
                          <option
                            key={status}
                            value={status}
                          >
                            {status}
                          </option>
                        ))}

                      </select>

                    </div>

                  </div>

                  <button
                    type="submit"
                    disabled={updatingPayment || newPaymentStatus === selectedOrder.payment_status}
                    style={styles.updateButton}
                  >
                    {updatingPayment ? "Updating..." : "Update Payment"}
                  </button>

                </form>

              </div>

              {orderHistory.length > 0 && (
                <div style={styles.detailSection}>

                  <h3 style={styles.detailTitle}>
                    Status History
                  </h3>

                  <div style={styles.historyList}>

                    {orderHistory.map((item) => (
                      <div key={item.id} style={styles.historyItem}>

                        <div style={styles.historyDot} />

                        <div style={styles.historyContent}>

                          <div style={styles.historyHeader}>
                            <span style={getStatusStyle(item.status)}>
                              {item.status.replace(/_/g, " ")}
                            </span>
                            <span style={styles.historyDate}>
                              {formatDate(item.created_at)}
                            </span>
                          </div>

                          {item.note && (
                            <p style={styles.historyNote}>
                              {item.note}
                            </p>
                          )}

                        </div>

                      </div>
                    ))}

                  </div>

                </div>
              )}

            </div>

          </div>

        </div>
      )}

    </div>
  )
}


const styles = {

  page: {
    padding: "32px",
    maxWidth: "1400px",
    margin: "0 auto"
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px"
  },

  title: {
    margin: 0,
    fontSize: "28px",
    fontWeight: 700
  },

  subtitle: {
    marginTop: "6px",
    marginBottom: 0,
    color: "#666"
  },

  error: {
    padding: "12px 16px",
    marginBottom: "20px",
    borderRadius: "7px",
    backgroundColor: "#ffe5e5",
    color: "#b00020",
    border: "1px solid #ffcccc"
  },

  filters: {
    display: "flex",
    gap: "15px",
    marginBottom: "20px",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    border: "1px solid #ddd",
    alignItems: "flex-end"
  },

  filterGroup: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "6px"
  },

  label: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#555"
  },

  select: {
    padding: "10px 12px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "14px",
    minWidth: "180px"
  },

  input: {
    padding: "10px 12px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "14px",
    width: "100%",
    boxSizing: "border-box" as const
  },

  applyButton: {
    padding: "10px 18px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#222",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "14px"
  },

  listCard: {
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "10px",
    overflow: "hidden"
  },

  listHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 24px",
    borderBottom: "1px solid #eee"
  },

  listTitle: {
    margin: 0,
    fontSize: "20px"
  },

  listSubtitle: {
    margin: "5px 0 0",
    color: "#777",
    fontSize: "14px"
  },

  count: {
    padding: "5px 10px",
    borderRadius: "20px",
    backgroundColor: "#f0f0f0",
    fontWeight: 600
  },

  tableWrapper: {
    overflowX: "auto" as const
  },

  table: {
    width: "100%",
    borderCollapse: "collapse" as const
  },

  th: {
    padding: "15px 20px",
    textAlign: "left" as const,
    borderBottom: "1px solid #ddd",
    fontSize: "14px",
    backgroundColor: "#fafafa",
    whiteSpace: "nowrap" as const
  },

  td: {
    padding: "15px 20px",
    borderBottom: "1px solid #eee",
    verticalAlign: "middle" as const
  },

  tr: {
    height: "60px"
  },

  cellSub: {
    margin: "3px 0 0",
    color: "#777",
    fontSize: "12px"
  },

  empty: {
    padding: "50px",
    textAlign: "center" as const,
    color: "#666"
  },

  viewButton: {
    padding: "7px 14px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    backgroundColor: "#fff",
    cursor: "pointer",
    fontSize: "13px"
  },

  modalOverlay: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    padding: "20px"
  },

  modal: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "900px",
    maxHeight: "90vh",
    overflow: "auto" as const,
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
  },

  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "24px",
    borderBottom: "1px solid #eee"
  },

  modalTitle: {
    margin: 0,
    fontSize: "22px"
  },

  closeButton: {
    border: "none",
    backgroundColor: "transparent",
    fontSize: "28px",
    cursor: "pointer",
    color: "#666"
  },

  modalBody: {
    padding: "24px"
  },

  sectionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px",
    marginBottom: "24px"
  },

  detailSection: {
    marginBottom: "24px",
    padding: "20px",
    backgroundColor: "#fafafa",
    borderRadius: "8px"
  },

  detailTitle: {
    margin: "0 0 16px",
    fontSize: "16px",
    fontWeight: 600
  },

  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    borderBottom: "1px solid #eee"
  },

  detailLabel: {
    color: "#666",
    fontSize: "14px"
  },

  detailValue: {
    fontWeight: 600,
    fontSize: "14px"
  },

  noData: {
    color: "#999",
    fontSize: "14px"
  },

  itemsList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px"
  },

  itemRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px",
    backgroundColor: "#fff",
    borderRadius: "6px",
    border: "1px solid #eee"
  },

  itemInfo: {
    flex: 1
  },

  itemPrice: {
    margin: "4px 0 0",
    color: "#666",
    fontSize: "13px"
  },

  itemTotal: {
    fontWeight: 600,
    fontSize: "15px"
  },

  invoiceSummary: {
    marginTop: "16px",
    padding: "16px",
    backgroundColor: "#fff",
    borderRadius: "6px",
    border: "1px solid #eee"
  },

  invoiceRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "6px 0",
    fontSize: "14px"
  },

  invoiceDivider: {
    border: "none",
    borderTop: "1px solid #eee",
    margin: "10px 0"
  },

  invoiceRowTotal: {
    display: "flex",
    justifyContent: "space-between",
    padding: "6px 0",
    fontSize: "16px",
    fontWeight: 700
  },

  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "15px"
  },

  formRow: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "15px"
  },

  formGroup: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "6px"
  },

  updateButton: {
    padding: "10px 18px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#222",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "14px"
  },

  historyList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "15px"
  },

  historyItem: {
    display: "flex",
    gap: "12px",
    alignItems: "flex-start"
  },

  historyDot: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    backgroundColor: "#222",
    marginTop: "4px",
    flexShrink: 0
  },

  historyContent: {
    flex: 1
  },

  historyHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "4px"
  },

  historyDate: {
    fontSize: "12px",
    color: "#999"
  },

  historyNote: {
    margin: "4px 0 0",
    color: "#555",
    fontSize: "13px"
  }
}

export default AdminOrdersPage
