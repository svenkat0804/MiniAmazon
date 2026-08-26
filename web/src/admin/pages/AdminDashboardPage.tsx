import { useState } from "react"
import AdminCategoriesPage from "./AdminCategoriesPage"
import AdminProductsPage from "./AdminProductsPage"

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

function AdminDashboardPage({
  onLogout
}: AdminDashboardPageProps) {

  const [activeMenu, setActiveMenu] =
    useState<MenuItem>("dashboard")

  const adminData =
    localStorage.getItem("mini-amazon-admin")

  const admin = adminData
    ? JSON.parse(adminData)
    : null


  // =============================
  // Logout
  // =============================

  const handleLogout = () => {

    localStorage.removeItem(
      "mini-amazon-admin-token"
    )

    localStorage.removeItem(
      "mini-amazon-admin"
    )

    onLogout()
  }


  return (

    <div style={styles.container}>

      {/* =============================
          SIDEBAR
      ============================== */}

      <aside style={styles.sidebar}>

        <h2 style={styles.logo}>
          MiniAmazon
        </h2>

        <p style={styles.adminLabel}>
          Admin Panel
        </p>


        <nav>

          {/* Dashboard */}

          <MenuButton
            title="Dashboard"
            active={
              activeMenu === "dashboard"
            }
            onClick={() =>
              setActiveMenu("dashboard")
            }
          />


          {/* Categories */}

          <MenuButton
            title="Categories"
            active={
              activeMenu === "categories"
            }
            onClick={() =>
              setActiveMenu("categories")
            }
          />


          {/* Products */}

          <MenuButton
            title="Products"
            active={
              activeMenu === "products"
            }
            onClick={() =>
              setActiveMenu("products")
            }
          />


          {/* Inventory */}

          <MenuButton
            title="Inventory"
            active={
              activeMenu === "inventory"
            }
            onClick={() =>
              setActiveMenu("inventory")
            }
          />


          {/* Orders */}

          <MenuButton
            title="Orders"
            active={
              activeMenu === "orders"
            }
            onClick={() =>
              setActiveMenu("orders")
            }
          />


          {/* Customers */}

          <MenuButton
            title="Customers"
            active={
              activeMenu === "customers"
            }
            onClick={() =>
              setActiveMenu("customers")
            }
          />

        </nav>


        {/* Logout */}

        <button
          type="button"
          onClick={handleLogout}
          style={styles.logoutButton}
        >
          Logout
        </button>

      </aside>


      {/* =============================
          MAIN CONTENT
      ============================== */}
        <main style={styles.main}>

        {activeMenu === "dashboard" && (
            <div>
                <h1>Dashboard</h1>

                <p>
                Welcome back, {admin?.name || "Admin"}
                </p>

                <div style={styles.cards}>

                <DashboardCard
                    title="Categories"
                    value="0"
                />

                <DashboardCard
                    title="Products"
                    value="0"
                />

                <DashboardCard
                    title="Orders"
                    value="0"
                />

                <DashboardCard
                    title="Customers"
                    value="0"
                />

                </div>
            </div>
            )}


            {activeMenu === "categories" && (
            <AdminCategoriesPage />
            )}

            {activeMenu === "products" && (
            <AdminProductsPage />
            )}


        {activeMenu !== "dashboard" &&
            activeMenu !== "categories" &&
            activeMenu !== "products" && (

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


// =====================================
// MENU BUTTON
// =====================================

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


// =====================================
// DASHBOARD CARD
// =====================================

function DashboardCard({
  title,
  value
}: {
  title: string
  value: string
}) {

  return (

    <div style={styles.card}>

      <p style={styles.cardTitle}>
        {title}
      </p>

      <h2 style={styles.cardValue}>
        {value}
      </h2>

    </div>

  )
}


// =====================================
// STYLES
// =====================================

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
    padding: "30px"
  },

  header: {
    marginBottom: "30px"
  },

  cards: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, 1fr)",
    gap: "20px"
  },

  card: {
    backgroundColor: "#fff",
    padding: "25px",
    borderRadius: "10px",
    boxShadow:
      "0 2px 10px rgba(0,0,0,0.08)"
  },

  cardTitle: {
    color: "#666"
  },

  cardValue: {
    fontSize: "30px",
    margin: "10px 0"
  },

  contentBox: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "10px"
  }

}

export default AdminDashboardPage