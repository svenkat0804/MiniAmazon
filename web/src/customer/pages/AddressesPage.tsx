import { useState } from "react"
import { Link } from "react-router-dom"

type Address = {
  id: number
  name: string
  phone: string
  addressLine: string
  city: string
  state: string
  pincode: string
  isDefault: boolean
}

function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>(() => {
    try {
      const saved = localStorage.getItem("mini-amazon-profile")
      if (saved) {
        const profile = JSON.parse(saved)
        return profile.addresses || []
      }
    } catch {
      // ignore parse errors
    }
    return []
  })

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState({
    name: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false
  })

  const saveProfile = (updatedAddresses: Address[]) => {
    try {
      const saved = localStorage.getItem("mini-amazon-profile")
      if (saved) {
        const profile = JSON.parse(saved)
        profile.addresses = updatedAddresses
        localStorage.setItem("mini-amazon-profile", JSON.stringify(profile))
      }
    } catch {
      // ignore parse errors
    }
  }

  const handleSubmit = () => {
    if (!form.name || !form.phone || !form.addressLine || !form.city || !form.state || !form.pincode) {
      alert("Please fill all fields")
      return
    }

    let updated: Address[]
    if (editingId) {
      updated = addresses.map(a => a.id === editingId ? { ...form, id: editingId } : a)
    } else {
      const newId = addresses.length > 0 ? Math.max(...addresses.map(a => a.id)) + 1 : 1
      updated = [...addresses, { ...form, id: newId }]
    }

    if (form.isDefault) {
      updated = updated.map(a => ({ ...a, isDefault: a.id === (editingId || 0) }))
    }

    setAddresses(updated)
    saveProfile(updated)
    setShowForm(false)
    setEditingId(null)
    setForm({ name: "", phone: "", addressLine: "", city: "", state: "", pincode: "", isDefault: false })
  }

  const handleEdit = (address: Address) => {
    setEditingId(address.id)
    setForm({
      name: address.name,
      phone: address.phone,
      addressLine: address.addressLine,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      isDefault: address.isDefault
    })
    setShowForm(true)
  }

  const handleDelete = (id: number) => {
    const updated = addresses.filter(a => a.id !== id)
    setAddresses(updated)
    saveProfile(updated)
  }

  const handleSetDefault = (id: number) => {
    const updated = addresses.map(a => ({ ...a, isDefault: a.id === id }))
    setAddresses(updated)
    saveProfile(updated)
  }

  return (
    <main className="page-content">
      <h1>My Addresses</h1>

      <div style={{ marginBottom: "20px" }}>
        <Link to="/profile" style={styles.backLink}>
          ← Back to Profile
        </Link>
      </div>

      {!showForm && (
        <button
          type="button"
          onClick={() => {
            setEditingId(null)
            setForm({ name: "", phone: "", addressLine: "", city: "", state: "", pincode: "", isDefault: false })
            setShowForm(true)
          }}
          style={styles.addButton}
        >
          + Add New Address
        </button>
      )}

      {showForm && (
        <div style={styles.formCard}>
          <h2 style={styles.formTitle}>
            {editingId ? "Edit Address" : "Add New Address"}
          </h2>

          <div style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Phone</label>
              <input
                type="tel"
                value={form.phone}
                onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))}
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Address</label>
              <textarea
                value={form.addressLine}
                onChange={e => setForm(prev => ({ ...prev, addressLine: e.target.value }))}
                style={styles.textarea}
                rows={3}
              />
            </div>

            <div style={styles.row}>
              <div style={styles.field}>
                <label style={styles.label}>City</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={e => setForm(prev => ({ ...prev, city: e.target.value }))}
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>State</label>
                <input
                  type="text"
                  value={form.state}
                  onChange={e => setForm(prev => ({ ...prev, state: e.target.value }))}
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Pincode</label>
                <input
                  type="text"
                  value={form.pincode}
                  onChange={e => setForm(prev => ({ ...prev, pincode: e.target.value }))}
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={form.isDefault}
                  onChange={e => setForm(prev => ({ ...prev, isDefault: e.target.checked }))}
                />
                Set as default address
              </label>
            </div>

            <div style={styles.actions}>
              <button type="button" onClick={handleSubmit} style={styles.saveButton}>
                {editingId ? "Update" : "Add"} Address
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingId(null)
                }}
                style={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={styles.list}>
        {addresses.length === 0 ? (
          <p style={styles.empty}>No addresses saved yet.</p>
        ) : (
          addresses.map(address => (
            <div key={address.id} style={styles.addressCard}>
              <div style={styles.addressHeader}>
                <strong>{address.name}</strong>
                {address.isDefault && (
                  <span style={styles.defaultBadge}>Default</span>
                )}
              </div>
              <p style={styles.addressText}>
                {address.addressLine}<br />
                {address.city}, {address.state} - {address.pincode}<br />
                Phone: {address.phone}
              </p>
              <div style={styles.addressActions}>
                {!address.isDefault && (
                  <button
                    type="button"
                    onClick={() => handleSetDefault(address.id)}
                    style={styles.smallButton}
                  >
                    Set Default
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleEdit(address)}
                  style={styles.smallButton}
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(address.id)}
                  style={styles.smallButton}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  )
}

const styles = {
  backLink: {
    color: "#666",
    textDecoration: "none",
    fontSize: "14px"
  },
  addButton: {
    padding: "12px 20px",
    backgroundColor: "#222",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    marginBottom: "20px"
  },
  formCard: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    marginBottom: "30px"
  },
  formTitle: {
    margin: "0 0 20px",
    fontSize: "20px"
  },
  form: {
    display: "grid",
    gap: "20px"
  },
  field: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px"
  },
  row: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px"
  },
  label: {
    fontWeight: 600,
    fontSize: "14px",
    color: "#374151"
  },
  input: {
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "15px"
  },
  textarea: {
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "15px",
    fontFamily: "inherit"
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontWeight: 600,
    cursor: "pointer"
  },
  actions: {
    display: "flex",
    gap: "10px",
    marginTop: "10px"
  },
  saveButton: {
    padding: "12px 24px",
    backgroundColor: "#222",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 600
  },
  cancelButton: {
    padding: "12px 24px",
    backgroundColor: "#fff",
    color: "#333",
    border: "1px solid #ccc",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px"
  },
  list: {
    display: "grid",
    gap: "20px"
  },
  addressCard: {
    backgroundColor: "#fff",
    padding: "24px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
  },
  addressHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px"
  },
  defaultBadge: {
    padding: "4px 10px",
    backgroundColor: "#e8f5e9",
    color: "#2e7d32",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: 600
  },
  addressText: {
    color: "#666",
    lineHeight: "1.6",
    marginBottom: "16px"
  },
  addressActions: {
    display: "flex",
    gap: "10px"
  },
  smallButton: {
    padding: "8px 14px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    backgroundColor: "#fff",
    cursor: "pointer",
    fontSize: "13px"
  },
  empty: {
    textAlign: "center" as const,
    color: "#999",
    padding: "40px"
  }
}

export default AddressesPage
