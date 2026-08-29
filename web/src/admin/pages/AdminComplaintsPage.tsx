import { useEffect, useState } from "react"
import type { FormEvent } from "react"

import {
  adminGet,
  adminPut
} from "../api/adminApi"

type Complaint = {
  id: number
  customer_name: string
  customer_email: string
  subject: string
  message: string
  status: string
  created_at: string
  updated_at: string
}

const COMPLAINT_STATUSES = [
  "open",
  "in_progress",
  "resolved",
  "closed"
] as const

function AdminComplaintsPage() {

  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [statusFilter, setStatusFilter] = useState("")

  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)
  const [showDetail, setShowDetail] = useState(false)

  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [newStatus, setNewStatus] = useState("")


  const loadComplaints = async () => {
    try {
      setLoading(true)
      setError("")

      const params = new URLSearchParams()
      if (statusFilter) params.append("status", statusFilter)

      const data = await adminGet(`/admin/complaints?${params.toString()}`) as { complaints: Complaint[] }
      setComplaints(data.complaints || [])

    } catch (error) {

      console.error("Load complaints error:", error)

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load complaints"
      )

    } finally {
      setLoading(false)
    }
  }


  // eslint-disable react-hooks/exhaustive-deps
  useEffect(() => {
    loadComplaints()
  }, [])
  // eslint-enable react-hooks/exhaustive-deps


  const handleViewDetails = (complaint: Complaint) => {
    setSelectedComplaint(complaint)
    setShowDetail(true)
    setNewStatus(complaint.status)
  }


  const handleCloseDetail = () => {
    setShowDetail(false)
    setSelectedComplaint(null)
    setNewStatus("")
  }


  const handleUpdateStatus = async (e: FormEvent) => {
    e.preventDefault()

    if (!selectedComplaint || !newStatus) return

    try {
      setUpdatingStatus(true)
      setError("")

      await adminPut(`/admin/complaints/${selectedComplaint.id}/status`, {
        status: newStatus
      })

      await loadComplaints()

      setSelectedComplaint({
        ...selectedComplaint,
        status: newStatus
      })

    } catch (error) {

      console.error("Update complaint status error:", error)

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update complaint status"
      )

    } finally {
      setUpdatingStatus(false)
    }
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
      open: { bg: "#fff3e0", color: "#e65100" },
      in_progress: { bg: "#e3f2fd", color: "#1565c0" },
      resolved: { bg: "#e8f5e9", color: "#2e7d32" },
      closed: { bg: "#f5f5f5", color: "#616161" }
    }

    const style = colors[status] || { bg: "#f5f5f5", color: "#616161" }

    return {
      display: "inline-block",
      padding: "5px 10px",
      borderRadius: "20px",
      backgroundColor: style.bg,
      color: style.color,
      fontSize: "12px",
      fontWeight: 600,
      textTransform: "uppercase" as const
    }
  }


  return (
    <div style={styles.page}>

      <div style={styles.header}>

        <div>

          <h1 style={styles.title}>
            Complaints & Support
          </h1>

          <p style={styles.subtitle}>
            Manage customer complaints and support tickets
          </p>

        </div>

      </div>

      {error && !showDetail && (
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
            Status
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

            {COMPLAINT_STATUSES.map((status) => (
              <option
                key={status}
                value={status}
              >
                {status.replace(/_/g, " ")}
              </option>
            ))}

          </select>

        </div>

        <button
          type="button"
          onClick={loadComplaints}
          style={styles.applyButton}
        >
          Apply Filters
        </button>

      </div>

      <div style={styles.listCard}>

        <div style={styles.listHeader}>

          <div>

            <h2 style={styles.listTitle}>
              Complaints List
            </h2>

            <p style={styles.listSubtitle}>
              All support tickets
            </p>

          </div>

          <span style={styles.count}>
            {complaints.length}
          </span>

        </div>

        {loading ? (
          <div style={styles.empty}>
            <p>
              Loading complaints...
            </p>
          </div>
        ) : complaints.length === 0 ? (
          <div style={styles.empty}>
            <p>
              No complaints found.
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
                    Subject
                  </th>

                  <th style={styles.th}>
                    Status
                  </th>

                  <th style={styles.th}>
                    Created
                  </th>

                  <th style={styles.th}>
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {complaints.map((complaint) => (
                  <tr key={complaint.id} style={styles.tr}>

                    <td style={styles.td}>
                      #{complaint.id}
                    </td>

                    <td style={styles.td}>

                      <div>

                        <strong>
                          {complaint.customer_name}
                        </strong>

                        <p style={styles.cellSub}>
                          {complaint.customer_email}
                        </p>

                      </div>

                    </td>

                    <td style={styles.td}>
                      {complaint.subject}
                    </td>

                    <td style={styles.td}>
                      <span style={getStatusStyle(complaint.status)}>
                        {complaint.status.replace(/_/g, " ")}
                      </span>
                    </td>

                    <td style={styles.td}>
                      {formatDate(complaint.created_at)}
                    </td>

                    <td style={styles.td}>

                      <button
                        type="button"
                        onClick={() =>
                          handleViewDetails(complaint)
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

      {showDetail && selectedComplaint && (
        <div style={styles.modalOverlay}>

          <div style={styles.modal}>

            <div style={styles.modalHeader}>

              <h2 style={styles.modalTitle}>
                Complaint #{selectedComplaint.id}
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

              <div style={styles.detailSection}>

                <h3 style={styles.detailTitle}>
                  Customer Information
                </h3>

                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>
                    Name
                  </span>
                  <span style={styles.detailValue}>
                    {selectedComplaint.customer_name}
                  </span>
                </div>

                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>
                    Email
                  </span>
                  <span style={styles.detailValue}>
                    {selectedComplaint.customer_email}
                  </span>
                </div>

              </div>

              <div style={styles.detailSection}>

                <h3 style={styles.detailTitle}>
                  Complaint Details
                </h3>

                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>
                    Subject
                  </span>
                  <span style={styles.detailValue}>
                    {selectedComplaint.subject}
                  </span>
                </div>

                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>
                    Status
                  </span>
                  <span style={getStatusStyle(selectedComplaint.status)}>
                    {selectedComplaint.status.replace(/_/g, " ")}
                  </span>
                </div>

                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>
                    Created
                  </span>
                  <span style={styles.detailValue}>
                    {formatDate(selectedComplaint.created_at)}
                  </span>
                </div>

                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>
                    Last Updated
                  </span>
                  <span style={styles.detailValue}>
                    {formatDate(selectedComplaint.updated_at)}
                  </span>
                </div>

                <div style={styles.messageBox}>

                  <label style={styles.messageLabel}>
                    Message
                  </label>

                  <p style={styles.messageText}>
                    {selectedComplaint.message}
                  </p>

                </div>

              </div>

              <div style={styles.detailSection}>

                <h3 style={styles.detailTitle}>
                  Update Status
                </h3>

                <form onSubmit={handleUpdateStatus} style={styles.form}>

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

                      {COMPLAINT_STATUSES.map((status) => (
                        <option
                          key={status}
                          value={status}
                        >
                          {status.replace(/_/g, " ")}
                        </option>
                      ))}

                    </select>

                  </div>

                  <button
                    type="submit"
                    disabled={updatingStatus || newStatus === selectedComplaint.status}
                    style={styles.updateButton}
                  >
                    {updatingStatus ? "Updating..." : "Update Status"}
                  </button>

                </form>

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
    maxWidth: "700px",
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

  messageBox: {
    marginTop: "12px",
    padding: "16px",
    backgroundColor: "#fff",
    borderRadius: "6px",
    border: "1px solid #eee"
  },

  messageLabel: {
    display: "block",
    marginBottom: "8px",
    fontSize: "13px",
    fontWeight: 600,
    color: "#555"
  },

  messageText: {
    margin: 0,
    fontSize: "14px",
    lineHeight: 1.6,
    color: "#333"
  },

  form: {
    display: "flex",
    flexDirection: "column" as const,
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
  }
}

export default AdminComplaintsPage
