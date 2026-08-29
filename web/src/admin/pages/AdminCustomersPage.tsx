import { useEffect, useState, type FormEvent } from "react"

import {
  adminGet,
  adminPut
} from "../api/adminApi"

type Customer = {
  id: number
  name: string
  email: string
  phone: string | null
  address: string | null
  city: string | null
  state: string | null
  pincode: string | null
  created_at: string
}

type CustomerOrder = {
  id: number
  customer_name: string
  customer_email: string
  items: unknown[]
  subtotal: number
  shipping_cost: number
  total: number
  payment_method: string
  payment_status: string
  order_status: string
  created_at: string
}

function AdminCustomersPage() {

  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [customerOrders, setCustomerOrders] = useState<CustomerOrder[]>([])
  const [showDetail, setShowDetail] = useState(false)
  const [loadingOrders, setLoadingOrders] = useState(false)

  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [editName, setEditName] = useState("")
  const [editEmail, setEditEmail] = useState("")
  const [editPhone, setEditPhone] = useState("")
  const [editAddress, setEditAddress] = useState("")
  const [editCity, setEditCity] = useState("")
  const [editState, setEditState] = useState("")
  const [editPincode, setEditPincode] = useState("")
  const [updating, setUpdating] = useState(false)


  const loadCustomers = async () => {
    try {
      setLoading(true)
      setError("")

      const data = await adminGet("/admin/customers") as { customers: Customer[] }
      setCustomers(data.customers || [])

    } catch (error) {

      console.error("Load customers error:", error)

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load customers"
      )

    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    loadCustomers()
  }, [])


  const handleViewDetails = async (customer: Customer) => {
    try {
      setSelectedCustomer(customer)
      setShowDetail(true)
      setLoadingOrders(true)

      const data = await adminGet(`/admin/customers/${customer.id}/orders`) as { orders: { id: number; customer_name: string; customer_email: string; items: unknown[]; subtotal: number; shipping_cost: number; total: number; payment_method: string; payment_status: string; order_status: string; created_at: string }[] }
      setCustomerOrders(data.orders || [])

    } catch (error) {

      console.error("Load customer orders error:", error)

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load customer orders"
      )

    } finally {
      setLoadingOrders(false)
    }
  }


  const handleCloseDetail = () => {
    setShowDetail(false)
    setSelectedCustomer(null)
    setCustomerOrders([])
  }


  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer)
    setEditName(customer.name)
    setEditEmail(customer.email)
    setEditPhone(customer.phone || "")
    setEditAddress(customer.address || "")
    setEditCity(customer.city || "")
    setEditState(customer.state || "")
    setEditPincode(customer.pincode || "")
    setError("")
  }


  const handleCancelEdit = () => {
    setEditingCustomer(null)
    setEditName("")
    setEditEmail("")
    setEditPhone("")
    setEditAddress("")
    setEditCity("")
    setEditState("")
    setEditPincode("")
    setError("")
  }


  const handleUpdateCustomer = async (e: FormEvent) => {
    e.preventDefault()

    if (!editingCustomer) return

    try {
      setUpdating(true)
      setError("")

      await adminPut(`/admin/customers/${editingCustomer.id}`, {
        name: editName,
        email: editEmail,
        phone: editPhone || null,
        address: editAddress || null,
        city: editCity || null,
        state: editState || null,
        pincode: editPincode || null
      })

      await loadCustomers()

      setEditingCustomer(null)

    } catch (error) {

      console.error("Update customer error:", error)

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update customer"
      )

    } finally {
      setUpdating(false)
    }
  }


  const filteredCustomers = customers.filter((customer) => {
    if (!searchQuery.trim()) return true

    const query = searchQuery.toLowerCase()
    return (
      customer.name.toLowerCase().includes(query) ||
      customer.email.toLowerCase().includes(query) ||
      (customer.phone && customer.phone.includes(query)) ||
      (customer.city && customer.city.toLowerCase().includes(query))
    )
  })


  const formatCurrency = (amount: number) => {
    return `₹${Number(amount).toLocaleString("en-IN")}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    })
  }

  const getTotalSpent = (orders: CustomerOrder[]) => {
    return orders.reduce((sum, order) => sum + order.total, 0)
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
      FAILED: { bg: "#ffebee", color: "#c62828" }
    }

    const style = colors[status] || { bg: "#f5f5f5", color: "#616161" }

    return {
      display: "inline-block",
      padding: "4px 10px",
      borderRadius: "20px",
      backgroundColor: style.bg,
      color: style.color,
      fontSize: "12px",
      fontWeight: 600
    }
  }


  return (
    <div style={styles.page}>

      {editingCustomer && (
        <div style={styles.formCard}>

          <div style={styles.formHeader}>

            <div>

              <h2 style={styles.formTitle}>
                Edit Customer
              </h2>

              <p style={styles.formSubtitle}>
                Update customer information
              </p>

            </div>

            <button
              type="button"
              onClick={handleCancelEdit}
              style={styles.closeButton}
            >
              ×
            </button>

          </div>

          <form onSubmit={handleUpdateCustomer}>

            <div style={styles.formGrid}>

              <div style={styles.field}>

                <label style={styles.label}>
                  Name
                </label>

                <input
                  type="text"
                  value={editName}
                  onChange={(event) =>
                    setEditName(event.target.value)
                  }
                  disabled={updating}
                  style={styles.input}
                />

              </div>

              <div style={styles.field}>

                <label style={styles.label}>
                  Email
                </label>

                <input
                  type="email"
                  value={editEmail}
                  onChange={(event) =>
                    setEditEmail(event.target.value)
                  }
                  disabled={updating}
                  style={styles.input}
                />

              </div>

              <div style={styles.field}>

                <label style={styles.label}>
                  Phone
                </label>

                <input
                  type="text"
                  value={editPhone}
                  onChange={(event) =>
                    setEditPhone(event.target.value)
                  }
                  disabled={updating}
                  style={styles.input}
                />

              </div>

              <div style={styles.field}>

                <label style={styles.label}>
                  City
                </label>

                <input
                  type="text"
                  value={editCity}
                  onChange={(event) =>
                    setEditCity(event.target.value)
                  }
                  disabled={updating}
                  style={styles.input}
                />

              </div>

              <div style={styles.fieldFull}>

                <label style={styles.label}>
                  Address
                </label>

                <textarea
                  value={editAddress}
                  onChange={(event) =>
                    setEditAddress(event.target.value)
                  }
                  disabled={updating}
                  rows={2}
                  style={styles.textarea}
                />

              </div>

              <div style={styles.field}>

                <label style={styles.label}>
                  State
                </label>

                <input
                  type="text"
                  value={editState}
                  onChange={(event) =>
                    setEditState(event.target.value)
                  }
                  disabled={updating}
                  style={styles.input}
                />

              </div>

              <div style={styles.field}>

                <label style={styles.label}>
                  Pincode
                </label>

                <input
                  type="text"
                  value={editPincode}
                  onChange={(event) =>
                    setEditPincode(event.target.value)
                  }
                  disabled={updating}
                  style={styles.input}
                />

              </div>

            </div>

            <div style={styles.formActions}>

              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={updating}
                style={styles.cancelButton}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={updating}
                style={styles.saveButton}
              >
                {updating ? "Updating..." : "Update Customer"}
              </button>

            </div>

          </form>

        </div>
      )}

      <div style={styles.header}>

        <div>

          <h1 style={styles.title}>
            Customers
          </h1>

          <p style={styles.subtitle}>
            Manage customer accounts
          </p>

        </div>

      </div>

      {error && !showDetail && (
        <div style={styles.error}>
          {error}
        </div>
      )}

      <div style={styles.searchBar}>

        <input
          type="text"
          placeholder="Search customers by name, email, phone, or city..."
          value={searchQuery}
          onChange={(event) =>
            setSearchQuery(event.target.value)
          }
          style={styles.searchInput}
        />

      </div>

      <div style={styles.listCard}>

        <div style={styles.listHeader}>

          <div>

            <h2 style={styles.listTitle}>
              Customer List
            </h2>

            <p style={styles.listSubtitle}>
              All registered customers
            </p>

          </div>

          <span style={styles.count}>
            {filteredCustomers.length}
          </span>

        </div>

        {loading ? (
          <div style={styles.empty}>
            <p>
              Loading customers...
            </p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div style={styles.empty}>
            <p>
              {searchQuery ? "No customers match your search." : "No customers found."}
            </p>
          </div>
        ) : (
          <div style={styles.tableWrapper}>

            <table style={styles.table}>

              <thead>

                <tr>

                  <th style={styles.th}>
                    ID
                  </th>

                  <th style={styles.th}>
                    Customer
                  </th>

                  <th style={styles.th}>
                    Contact
                  </th>

                  <th style={styles.th}>
                    City
                  </th>

                  <th style={styles.th}>
                    Joined
                  </th>

                  <th style={styles.th}>
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} style={styles.tr}>

                    <td style={styles.td}>
                      #{customer.id}
                    </td>

                    <td style={styles.td}>

                      <div>

                        <strong>
                          {customer.name}
                        </strong>

                        <p style={styles.cellSub}>
                          {customer.email}
                        </p>

                      </div>

                    </td>

                    <td style={styles.td}>
                      {customer.phone || "N/A"}
                    </td>

                    <td style={styles.td}>
                      {customer.city || "N/A"}
                    </td>

                    <td style={styles.td}>
                      {formatDate(customer.created_at)}
                    </td>

                    <td style={styles.td}>

                      <button
                        type="button"
                        onClick={() =>
                          handleViewDetails(customer)
                        }
                        style={styles.viewButton}
                      >
                        View Details
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleEdit(customer)
                        }
                        style={styles.editButton}
                      >
                        Edit
                      </button>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {showDetail && selectedCustomer && (
        <div style={styles.modalOverlay}>

          <div style={styles.modal}>

            <div style={styles.modalHeader}>

              <h2 style={styles.modalTitle}>
                Customer #{selectedCustomer.id}
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
                    Personal Information
                  </h3>

                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>
                      Name
                    </span>
                    <span style={styles.detailValue}>
                      {selectedCustomer.name}
                    </span>
                  </div>

                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>
                      Email
                    </span>
                    <span style={styles.detailValue}>
                      {selectedCustomer.email}
                    </span>
                  </div>

                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>
                      Phone
                    </span>
                    <span style={styles.detailValue}>
                      {selectedCustomer.phone || "N/A"}
                    </span>
                  </div>

                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>
                      Joined
                    </span>
                    <span style={styles.detailValue}>
                      {formatDate(selectedCustomer.created_at)}
                    </span>
                  </div>

                </div>

                <div style={styles.detailSection}>

                  <h3 style={styles.detailTitle}>
                    Address
                  </h3>

                  {selectedCustomer.address ? (
                    <>
                      <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>
                          Address
                        </span>
                        <span style={styles.detailValue}>
                          {selectedCustomer.address}
                        </span>
                      </div>

                      <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>
                          City
                        </span>
                        <span style={styles.detailValue}>
                          {selectedCustomer.city}
                        </span>
                      </div>

                      <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>
                          State
                        </span>
                        <span style={styles.detailValue}>
                          {selectedCustomer.state}
                        </span>
                      </div>

                      <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>
                          Pincode
                        </span>
                        <span style={styles.detailValue}>
                          {selectedCustomer.pincode}
                        </span>
                      </div>
                    </>
                  ) : (
                    <p style={styles.noData}>
                      No address provided
                    </p>
                  )}

                </div>

              </div>

              <div style={styles.detailSection}>

                <h3 style={styles.detailTitle}>
                  Order History
                </h3>

                {loadingOrders ? (
                  <div style={styles.empty}>
                    <p>
                      Loading orders...
                    </p>
                  </div>
                ) : customerOrders.length === 0 ? (
                  <div style={styles.empty}>
                    <p>
                      No orders found for this customer.
                    </p>
                  </div>
                ) : (
                  <>
                    <div style={styles.customerSummary}>
                      <div style={styles.summaryItem}>
                        <span style={styles.summaryLabel}>
                          Total Orders
                        </span>
                        <span style={styles.summaryValue}>
                          {customerOrders.length}
                        </span>
                      </div>
                      <div style={styles.summaryItem}>
                        <span style={styles.summaryLabel}>
                          Total Spent
                        </span>
                        <span style={styles.summaryValue}>
                          {formatCurrency(getTotalSpent(customerOrders))}
                        </span>
                      </div>
                    </div>

                    <div style={styles.ordersList}>

                      {customerOrders.map((order) => (
                        <div key={order.id} style={styles.orderCard}>

                          <div style={styles.orderHeader}>

                            <div>
                              <strong>
                                Order #{order.id}
                              </strong>
                              <p style={styles.orderDate}>
                                {formatDate(order.created_at)}
                              </p>
                            </div>

                            <span style={getStatusStyle(order.order_status)}>
                              {order.order_status.replace(/_/g, " ")}
                            </span>

                          </div>

                          <div style={styles.orderBody}>

                            <div style={styles.orderInfo}>
                              <span>
                                {order.items?.length || 0} items
                              </span>
                              <span style={styles.orderTotal}>
                                {formatCurrency(order.total)}
                              </span>
                            </div>

                            <div style={styles.orderPayment}>
                              <span>
                                {order.payment_method}
                              </span>
                              <span style={getStatusStyle(order.payment_status)}>
                                {order.payment_status}
                              </span>
                            </div>

                          </div>

                        </div>
                      ))}

                    </div>
                  </>
                )}

              </div>

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

  searchBar: {
    marginBottom: "20px"
  },

  searchInput: {
    width: "100%",
    maxWidth: "500px",
    padding: "12px 16px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontSize: "14px",
    boxSizing: "border-box" as const
  },

  formCard: {
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "24px",
    marginBottom: "24px"
  },

  formHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px"
  },

  formTitle: {
    margin: 0,
    fontSize: "20px"
  },

  formSubtitle: {
    margin: "5px 0 0",
    color: "#777",
    fontSize: "14px"
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "20px"
  },

  field: {
    display: "flex",
    flexDirection: "column" as const
  },

  fieldFull: {
    gridColumn: "1 / -1",
    display: "flex",
    flexDirection: "column" as const
  },

  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: 600,
    fontSize: "14px"
  },

  input: {
    width: "100%",
    boxSizing: "border-box" as const,
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "15px",
    backgroundColor: "#fff"
  },

  textarea: {
    width: "100%",
    boxSizing: "border-box" as const,
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "15px",
    resize: "vertical" as const
  },

  formActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "24px"
  },

  cancelButton: {
    padding: "10px 18px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    backgroundColor: "#fff",
    cursor: "pointer"
  },

  saveButton: {
    padding: "10px 18px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: 600
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
    marginRight: "8px",
    padding: "7px 14px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    backgroundColor: "#fff",
    cursor: "pointer",
    fontSize: "13px"
  },

  editButton: {
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

  customerSummary: {
    display: "flex",
    gap: "20px",
    marginBottom: "16px",
    padding: "16px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    border: "1px solid #eee"
  },

  summaryItem: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "4px"
  },

  summaryLabel: {
    fontSize: "13px",
    color: "#666"
  },

  summaryValue: {
    fontSize: "20px",
    fontWeight: 700
  },

  ordersList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px"
  },

  orderCard: {
    padding: "16px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    border: "1px solid #eee"
  },

  orderHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px"
  },

  orderDate: {
    margin: "4px 0 0",
    color: "#777",
    fontSize: "12px"
  },

  orderBody: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  orderInfo: {
    display: "flex",
    gap: "15px",
    fontSize: "14px"
  },

  orderTotal: {
    fontWeight: 600
  },

  orderPayment: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    fontSize: "13px"
  }
}

export default AdminCustomersPage
