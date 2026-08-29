import { useState } from "react"

import { adminLogin } from "../api/adminApi"

type AdminLoginPageProps = {
  onLoginSuccess: () => void
}

function AdminLoginPage({
  onLoginSuccess
}: AdminLoginPageProps) {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async () => {

    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password")
      return
    }

    setLoading(true)
    setError("")

    try {

      const data = await adminLogin(
        email.trim(),
        password
      )

      localStorage.setItem(
        "mini-amazon-admin-token",
        data.token
      )

      localStorage.setItem(
        "mini-amazon-admin",
        JSON.stringify(data.admin)
      )

      onLoginSuccess()

    } catch (error) {

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      )

    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>

      <div style={styles.card}>

        <div style={styles.logo}>
          🛍️
        </div>

        <h1 style={styles.title}>
          DentalKart
        </h1>

        <p style={styles.subtitle}>
          Admin Panel
        </p>

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        <div style={styles.hint}>
          <strong>Demo credentials:</strong><br />
          admin@dentalkart.com / admin123
        </div>

        <div style={styles.formGroup}>

          <label style={styles.label}>
            Email
          </label>

          <input
            type="email"
            placeholder="Enter admin email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            style={styles.input}
          />

        </div>

        <div style={styles.formGroup}>

          <label style={styles.label}>
            Password
          </label>

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            style={styles.input}
          />

        </div>

        <button
          type="button"
          onClick={handleLogin}
          disabled={loading}
          style={styles.button}
        >
          {loading ? "Signing in..." : "Admin Login"}
        </button>

      </div>

    </div>
  )
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5"
  },

  card: {
    width: "380px",
    padding: "40px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
  },

  logo: {
    textAlign: "center" as const,
    fontSize: "40px"
  },

  title: {
    textAlign: "center" as const,
    marginBottom: "5px"
  },

  subtitle: {
    textAlign: "center" as const,
    color: "#666",
    marginBottom: "30px"
  },

  hint: {
    padding: "12px",
    marginBottom: "20px",
    backgroundColor: "#e8f5e9",
    color: "#2e7d32",
    borderRadius: "6px",
    fontSize: "13px",
    lineHeight: "1.5"
  },

  formGroup: {
    marginBottom: "20px"
  },

  label: {
    display: "block",
    marginBottom: "7px",
    fontWeight: "bold"
  },

  input: {
    width: "100%",
    padding: "12px",
    boxSizing: "border-box" as const,
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "15px"
  },

  button: {
    width: "100%",
    padding: "13px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#222",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer"
  },

  error: {
    padding: "10px",
    marginBottom: "20px",
    backgroundColor: "#ffe5e5",
    color: "#c00",
    borderRadius: "6px"
  }
}

export default AdminLoginPage
