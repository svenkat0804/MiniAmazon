import { useEffect, useState } from "react"
import AdminCategoriesPage from "./AdminCategoriesPage"
import AdminProductsPage from "./AdminProductsPage"
import AdminOrdersPage from "./AdminOrdersPage"
import AdminCustomersPage from "./AdminCustomersPage"
import AdminComplaintsPage from "./AdminComplaintsPage"

import {
  getAdminStats,
  getAdminCustomers,
  getAdminProducts,
  getAdminOrders,
  getAdminComplaints
} from "../api/adminApi"

type AdminDashboardPageProps = {
  onLogout: () => void
}

type MenuItem =
  | "dashboard"
  | "categories"
  | "products"
  | "inventory"
  | "orders"
  | "customers"
  | "complaints"
  | "supports"

function AdminDashboardPage({
  onLogout
}: AdminDashboardPageProps) {

  const [activeMenu, setActiveMenu] =
    useState<MenuItem>("dashboard")

  const [stats, setStats] = useState({
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    totalRevenue: 0,
    statusBreakdown: [] as { status: string; count: number }[],
    paymentBreakdown: [] as { payment_method: string; count: number }[]
  })

  const [recentOrders, setRecentOrders] = useState<{ id: number; customer_name: string; total: number; order_status: string; created_at: string }[]>([])
  const [recentComplaints, setRecentComplaints] = useState<{ id: number; customer_name: string; subject: string; status: string; created_at: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const adminData =
    localStorage.getItem("mini-amazon-admin")

  const admin = adminData
    ? JSON.parse(adminData)
    : null


  const handleLogout = () => {

    localStorage.removeItem(
      "mini-amazon-admin-token"
    )

    localStorage.removeItem(
      "mini-amazon-admin"
    )

    onLogout()
  }


  const loadDashboard = async () => {
    try {
      setLoading(true)
      setError("")

      const [statsData, customersData, productsData, ordersData, complaintsData] = await Promise.all([
        getAdminStats(),
        getAdminCustomers(),
        getAdminProducts(),
        getAdminOrders(),
        getAdminComplaints()
      ])

      const stats = statsData as { stats: { total_orders: number; total_revenue: number; status_breakdown: { status: string; count: number }[]; payment_breakdown: { payment_method: string; count: number }[] } }
      const customers = customersData as { customers: { id: number; name: string; email: string; phone: string }[] }
      const products = productsData as { products: { id: number; name: string; price: number; stock: number; is_active: boolean }[] }
      const orders = ordersData as { orders: { id: number; customer_name: string; total: number; order_status: string; created_at: string }[] }
      const complaints = complaintsData as { complaints: { id: number; customer_name: string; subject: string; status: string; created_at: string }[] }

      setStats({
        totalOrders: stats.stats.total_orders,
        totalCustomers: customers.customers?.length || 0,
        totalProducts: products.products?.length || 0,
        totalRevenue: stats.stats.total_revenue,
        statusBreakdown: stats.stats.status_breakdown || [],
        paymentBreakdown: stats.stats.payment_breakdown || []
      })

      setRecentOrders(orders.orders?.slice(0, 5) || [])
      setRecentComplaints(complaints.complaints?.slice(0, 5) || [])

    } catch (error) {

      console.error("Load dashboard error:", error)

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load dashboard"
      )

    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    loadDashboard()
  }, [])


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

  const getStatusBadge = (status: string) => {
    const colors: Record<string, { bg: string; color: string }> = {
      PLACED: { bg: "#e3f2fd", color: "#1565c0" },
      CONFIRMED: { bg: "#e8f5e9", color: "#2e7d32" },
      SHIPPED: { bg: "#fff3e0", color: "#e65100" },
      OUT_FOR_DELIVERY: { bg: "#f3e5f5", color: "#7b1fa2" },
      DELIVERED: { bg: "#e8f5e9", color: "#1b5e20" },
      CANCELLED: { bg: "#ffebee", color: "#c62828" },
      open: { bg: "#fff3e0", color: "#e65100" },
      in_progress: { bg: "#e3f2fd", color: "#1565c0" },
      resolved: { bg: "#e8f5e9", color: "#2e7d32" },
      closed: { bg: "#f5f5f5", color: "#616161" }
    }

    const style = colors[status] || { bg: "#f5f5f5", color: "#616161" }

    return {
      display: "inline-block",
      padding: "4px 10px",
      borderRadius: "20px",
      backgroundColor: style.bg,
      color: style.color,
      fontSize: "12px",
      fontWeight: 600,
      textTransform: "uppercase" as const
    }
  }

  return (
    <div style={styles.container}>

      <aside style={styles.sidebar}>

        <h2 style={styles.logo}>
          DentalKart
        </h2>

        <p style={styles.adminLabel}>
          Admin Panel
        </p>

        <nav>

          <MenuButton
            title="Dashboard"
            active={activeMenu === "dashboard"}
            onClick={() => setActiveMenu("dashboard")}
          />

          <MenuButton
            title="Categories"
            active={activeMenu === "categories"}
            onClick={() => setActiveMenu("categories")}
          />

          <MenuButton
            title="Products"
            active={activeMenu === "products"}
            onClick={() => setActiveMenu("products")}
          />

          <MenuButton
            title="Inventory"
            active={activeMenu === "inventory"}
            onClick={() => setActiveMenu("inventory")}
          />

          <MenuButton
            title="Orders"
            active={activeMenu === "orders"}
            onClick={() => setActiveMenu("orders")}
          />

          <MenuButton
            title="Customers"
            active={activeMenu === "customers"}
            onClick={() => setActiveMenu("customers")}
          />

          <MenuButton
            title="Complaints"
            active={activeMenu === "complaints"}
            onClick={() => setActiveMenu("complaints")}
          />

          <MenuButton
            title="Supports"
            active={activeMenu === "supports"}
            onClick={() => setActiveMenu("supports")}
          />

        </nav>

        <button
          type="button"
          onClick={handleLogout}
          style={styles.logoutButton}
        >
          Logout
        </button>

      </aside>

      <main style={styles.main}>

        {activeMenu === "dashboard" && (
          <div>
            <h1 style={styles.pageTitle}>
              Dashboard
            </h1>

            <p style={styles.welcomeText}>
              Welcome back, {admin?.name || "Admin"}
            </p>

            {error && (
              <div style={styles.error}>
                {error}
                <button
                  type="button"
                  onClick={loadDashboard}
                  style={styles.retryButton}
                >
                  Retry
                </button>
              </div>
            )}

            <div style={styles.cards}>

              <DashboardCard
                title="Total Orders"
                value={loading ? "..." : String(stats.totalOrders)}
                icon="📦"
              />

              <DashboardCard
                title="Total Customers"
                value={loading ? "..." : String(stats.totalCustomers)}
                icon="👥"
              />

              <DashboardCard
                title="Total Products"
                value={loading ? "..." : String(stats.totalProducts)}
                icon="🏷️"
              />

              <DashboardCard
                title="Total Revenue"
                value={loading ? "..." : formatCurrency(stats.totalRevenue)}
                icon="💰"
              />

            </div>

            <div style={styles.sections}>

              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>
                  Recent Orders
                </h2>

                <div style={styles.listCard}>

                  {recentOrders.length === 0 ? (
                    <div style={styles.empty}>
                      No orders yet
                    </div>
                  ) : (
                    <table style={styles.table}>
                      <thead>
                        <tr>
                          <th style={styles.th}>Order ID</th>
                          <th style={styles.th}>Customer</th>
                          <th style={styles.th}>Total</th>
                          <th style={styles.th}>Status</th>
                          <th style={styles.th}>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentOrders.map((order) => (
                          <tr key={order.id} style={styles.tr}>
                            <td style={styles.td}>
                              #{order.id}
                            </td>
                            <td style={styles.td}>
                              {order.customer_name}
                            </td>
                            <td style={styles.td}>
                              {formatCurrency(order.total)}
                            </td>
                            <td style={styles.td}>
                              <span style={getStatusBadge(order.order_status)}>
                                {order.order_status.replace(/_/g, " ")}
                              </span>
                            </td>
                            <td style={styles.td}>
                              {formatDate(order.created_at)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                </div>
              </div>

              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>
                  Recent Complaints
                </h2>

                <div style={styles.listCard}>

                  {recentComplaints.length === 0 ? (
                    <div style={styles.empty}>
                      No complaints yet
                    </div>
                  ) : (
                    <table style={styles.table}>
                      <thead>
                        <tr>
                          <th style={styles.th}>ID</th>
                          <th style={styles.th}>Customer</th>
                          <th style={styles.th}>Subject</th>
                          <th style={styles.th}>Status</th>
                          <th style={styles.th}>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentComplaints.map((complaint) => (
                          <tr key={complaint.id} style={styles.tr}>
                            <td style={styles.td}>
                              #{complaint.id}
                            </td>
                            <td style={styles.td}>
                              {complaint.customer_name}
                            </td>
                            <td style={styles.td}>
                              {complaint.subject}
                            </td>
                            <td style={styles.td}>
                              <span style={getStatusBadge(complaint.status)}>
                                {complaint.status.replace(/_/g, " ")}
                              </span>
                            </td>
                            <td style={styles.td}>
                              {formatDate(complaint.created_at)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                </div>
              </div>

            </div>
          </div>
        )}

        {activeMenu === "categories" && (
          <AdminCategoriesPage />
        )}

        {activeMenu === "products" && (
          <AdminProductsPage />
        )}

        {activeMenu === "orders" && (
          <AdminOrdersPage />
        )}

        {activeMenu === "customers" && (
          <AdminCustomersPage />
        )}

        {activeMenu === "complaints" && (
          <AdminComplaintsPage />
        )}

        {activeMenu === "supports" && (
          <AdminComplaintsPage />
        )}

        {activeMenu !== "dashboard" &&
          activeMenu !== "categories" &&
          activeMenu !== "products" &&
          activeMenu !== "orders" &&
          activeMenu !== "customers" &&
          activeMenu !== "complaints" &&
          activeMenu !== "supports" && (

          <div style={styles.contentBox}>

            <h2>
              {activeMenu}
            </h2>

            <p>
              {activeMenu} management
              will be added next.
            </p>

          </div>

        )}

      </main>

    </div>
  )
}


function MenuButton({
  title,
  active,
  onClick
}: {
  title: string
  active: boolean
  onClick: () => void
}) {

  return (

    <button
      type="button"
      onClick={onClick}
      style={{
        ...styles.menuButton,

        ...(active
          ? styles.activeMenu
          : {})
      }}
    >
      {title}
    </button>

  )
}


function DashboardCard({
  title,
  value,
  icon
}: {
  title: string
  value: string
  icon: string
}) {

  return (

    <div style={styles.card}>

      <div style={styles.cardIcon}>
        {icon}
      </div>

      <div>

        <p style={styles.cardTitle}>
          {title}
        </p>

        <h2 style={styles.cardValue}>
          {value}
        </h2>

      </div>

    </div>

  )
}


const styles = {

  container: {
    minHeight: "100vh",
    display: "flex",
    backgroundColor: "#f5f5f5"
  },

  sidebar: {
    width: "230px",
    minHeight: "100vh",
    padding: "25px 15px",
    backgroundColor: "#222",
    color: "#fff",
    display: "flex",
    flexDirection: "column" as const
  },

  logo: {
    margin: "0",
    textAlign: "center" as const
  },

  adminLabel: {
    textAlign: "center" as const,
    color: "#aaa",
    marginBottom: "30px"
  },

  menuButton: {
    width: "100%",
    padding: "13px",
    marginBottom: "8px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "transparent",
    color: "#fff",
    textAlign: "left" as const,
    cursor: "pointer",
    fontSize: "15px"
  },

  activeMenu: {
    backgroundColor: "#444"
  },

  logoutButton: {
    marginTop: "auto",
    padding: "12px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "15px"
  },

  main: {
    flex: 1,
    padding: "30px",
    overflow: "auto" as const
  },

  pageTitle: {
    margin: "0 0 10px",
    fontSize: "28px",
    fontWeight: 700
  },

  welcomeText: {
    margin: "0 0 30px",
    color: "#666",
    fontSize: "16px"
  },

  error: {
    padding: "12px 16px",
    marginBottom: "20px",
    borderRadius: "7px",
    backgroundColor: "#ffe5e5",
    color: "#b00020",
    border: "1px solid #ffcccc",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  retryButton: {
    padding: "6px 12px",
    border: "1px solid #b00020",
    borderRadius: "4px",
    backgroundColor: "#fff",
    color: "#b00020",
    cursor: "pointer",
    fontSize: "13px"
  },

  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
    marginBottom: "30px"
  },

  card: {
    backgroundColor: "#fff",
    padding: "25px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    display: "flex",
    alignItems: "center",
    gap: "15px"
  },

  cardIcon: {
    fontSize: "32px"
  },

  cardTitle: {
    color: "#666",
    margin: "0 0 5px",
    fontSize: "14px"
  },

  cardValue: {
    fontSize: "28px",
    margin: "0",
    fontWeight: 700
  },

  sections: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px"
  },

  section: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    overflow: "hidden"
  },

  sectionTitle: {
    margin: "0",
    padding: "20px 24px",
    fontSize: "18px",
    borderBottom: "1px solid #eee"
  },

  listCard: {
    overflow: "auto" as const
  },

  table: {
    width: "100%",
    borderCollapse: "collapse" as const
  },

  th: {
    padding: "12px 16px",
    textAlign: "left" as const,
    borderBottom: "1px solid #ddd",
    fontSize: "13px",
    backgroundColor: "#fafafa",
    fontWeight: 600,
    whiteSpace: "nowrap" as const
  },

  td: {
    padding: "12px 16px",
    borderBottom: "1px solid #eee",
    fontSize: "14px",
    verticalAlign: "middle" as const
  },

  tr: {
    height: "50px"
  },

  empty: {
    padding: "30px",
    textAlign: "center" as const,
    color: "#999"
  },

  contentBox: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "10px"
  }
}

export default AdminDashboardPage
