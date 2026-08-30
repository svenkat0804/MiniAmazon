import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

type Notification = {
  id: number
  role: string
  reference_id: number
  type: string
  title: string
  message: string
  data: unknown
  is_read: boolean
  created_at: string
}

type Pagination = {
  page: number
  limit: number
  total: number
  totalPages: number
}

function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const userData = localStorage.getItem("mini-amazon-user")
  const user = userData ? JSON.parse(userData) : null
  const userId = user?.id

  const fetchNotifications = async (page = 1) => {
    if (!userId) return

    try {
      setLoading(true)
      const data = await fetch(
        `http://localhost:5001/api/notifications?role=customer&reference_id=${userId}&page=${page}&limit=10`
      ).then(res => res.json())

      setNotifications(data.notifications || [])
      setPagination(data.pagination || null)
    } catch {
      setError("Failed to load notifications")
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: number) => {
    try {
      await fetch(`http://localhost:5001/api/notifications/${id}/read`, {
        method: "PUT"
      })
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      )
    } catch (err) {
      console.error("Failed to mark notification as read:", err)
    }
  }

  const markAllAsRead = async () => {
    try {
      await fetch("http://localhost:5001/api/notifications/mark-all-read", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "customer", reference_id: userId })
      })
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [userId])

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

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order":
        return "📦"
      case "delivery":
        return "🚚"
      case "offer":
        return "🎉"
      case "system":
        return "ℹ️"
      default:
        return "🔔"
    }
  }

  return (
    <main className="page-content">
      <div style={styles.header}>
        <div>
          <h1>Notifications</h1>
          <p style={styles.subtitle}>
            Stay updated with your orders and offers
          </p>
        </div>
        {notifications.some(n => !n.is_read) && (
          <button
            type="button"
            onClick={markAllAsRead}
            style={styles.markAllButton}
          >
            Mark all as read
          </button>
        )}
      </div>

      {error && (
        <div style={styles.error}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={styles.loading}>
          <div className="loading-spinner" />
          <p>Loading notifications...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>🔔</div>
          <h2>No notifications yet</h2>
          <p>You'll see order updates, delivery alerts, and special offers here.</p>
          <Link to="/" style={styles.shopLink}>
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div style={styles.list}>
          {notifications.map(notification => (
            <div
              key={notification.id}
              style={{
                ...styles.card,
                opacity: notification.is_read ? 0.7 : 1
              }}
              onClick={() => !notification.is_read && markAsRead(notification.id)}
            >
              <div style={styles.iconWrapper}>
                <span style={styles.icon}>
                  {getNotificationIcon(notification.type)}
                </span>
                {!notification.is_read && (
                  <span style={styles.unreadDot} />
                )}
              </div>

              <div style={styles.content}>
                <div style={styles.titleRow}>
                  <h3 style={styles.title}>{notification.title}</h3>
                  <span style={styles.time}>
                    {formatDate(notification.created_at)}
                  </span>
                </div>
                <p style={styles.message}>{notification.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div style={styles.pagination}>
          <button
            type="button"
            onClick={() => fetchNotifications(pagination.page - 1)}
            disabled={pagination.page === 1}
            style={styles.paginationButton}
          >
            Previous
          </button>
          <span style={styles.paginationInfo}>
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            type="button"
            onClick={() => fetchNotifications(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            style={styles.paginationButton}
          >
            Next
          </button>
        </div>
      )}
    </main>
  )
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "30px"
  },
  subtitle: {
    color: "#666",
    margin: "4px 0 0"
  },
  markAllButton: {
    padding: "10px 20px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    backgroundColor: "#fff",
    color: "#333",
    cursor: "pointer",
    fontSize: "14px"
  },
  error: {
    padding: "12px",
    backgroundColor: "#ffe5e5",
    color: "#c00",
    borderRadius: "6px",
    marginBottom: "20px"
  },
  loading: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    padding: "60px",
    gap: "16px"
  },
  empty: {
    textAlign: "center" as const,
    padding: "60px 20px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
  },
  emptyIcon: {
    fontSize: "48px",
    marginBottom: "16px"
  },
  shopLink: {
    display: "inline-block",
    marginTop: "20px",
    padding: "12px 24px",
    backgroundColor: "#222",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "6px",
    fontSize: "14px"
  },
  list: {
    display: "grid",
    gap: "16px"
  },
  card: {
    display: "flex",
    gap: "16px",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    cursor: "pointer",
    transition: "opacity 0.2s"
  },
  iconWrapper: {
    position: "relative" as const,
    flexShrink: 0
  },
  icon: {
    fontSize: "24px",
    lineHeight: 1
  },
  unreadDot: {
    position: "absolute" as const,
    top: "-2px",
    right: "-2px",
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: "#c00"
  },
  content: {
    flex: 1,
    minWidth: 0
  },
  titleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "8px",
    gap: "12px"
  },
  title: {
    margin: 0,
    fontSize: "16px",
    fontWeight: 600
  },
  time: {
    fontSize: "12px",
    color: "#888",
    whiteSpace: "nowrap" as const
  },
  message: {
    margin: 0,
    color: "#444",
    fontSize: "14px",
    lineHeight: "1.5"
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "16px",
    padding: "30px"
  },
  paginationButton: {
    padding: "10px 20px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    background: "#fff",
    cursor: "pointer",
    fontSize: "14px"
  },
  paginationInfo: {
    fontSize: "14px",
    color: "#666"
  }
}

export default NotificationsPage
