import { useState, useEffect } from "react"
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

type Profile = {
  name: string
  email: string
  phone: string
  dob: string
  image: string
  addresses: Address[]
}

const DEFAULT_PROFILE: Profile = {
  name: "",
  email: "",
  phone: "",
  dob: "",
  image: "",
  addresses: []
}

function ProfilePage() {
  const [profile, setProfile] = useState<Profile>(() => {
    try {
      const saved = localStorage.getItem("mini-amazon-profile")
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE
    } catch {
      return DEFAULT_PROFILE
    }
  })

  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    localStorage.setItem("mini-amazon-profile", JSON.stringify(profile))
  }, [profile])

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setError("")
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"]
    if (!allowedTypes.includes(file.type)) {
      setError("Invalid file type. Please upload PNG, JPG, JPEG, WEBP, or GIF.")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB")
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setProfile(prev => ({
        ...prev,
        image: reader.result as string
      }))
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage("")
    await new Promise(resolve => setTimeout(resolve, 500))
    setMessage("Profile updated successfully")
    setSaving(false)
  }

  return (
    <main className="page-content">
      <h1>My Profile</h1>

      {error && (
        <div style={{
          padding: "12px",
          marginBottom: "20px",
          backgroundColor: "#ffe5e5",
          color: "#c00",
          borderRadius: "6px"
        }}>
          {error}
        </div>
      )}

      {message && (
        <div style={{
          padding: "12px",
          marginBottom: "20px",
          backgroundColor: "#e8f5e9",
          color: "#2e7d32",
          borderRadius: "6px"
        }}>
          {message}
        </div>
      )}

      <div style={styles.card}>
        <div style={styles.avatarSection}>
          {profile.image ? (
            <img src={profile.image} alt="Profile" style={styles.avatar} />
          ) : (
            <div style={styles.avatarPlaceholder}>
              {profile.name.charAt(0).toUpperCase() || "U"}
            </div>
          )}
          <label style={styles.uploadLabel}>
            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
              onChange={handleImageChange}
              style={styles.fileInput}
            />
            {profile.image ? "Change Photo" : "Upload Photo"}
          </label>

          <p style={styles.uploadHint}>
            Supported: PNG, JPG, JPEG, WEBP, GIF (Max 5MB)
          </p>
        </div>

        <div style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={e => setProfile(prev => ({ ...prev, name: e.target.value }))}
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={e => setProfile(prev => ({ ...prev, email: e.target.value }))}
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Mobile Number</label>
            <input
              type="tel"
              value={profile.phone}
              onChange={e => setProfile(prev => ({ ...prev, phone: e.target.value }))}
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Date of Birth</label>
            <input
              type="date"
              value={profile.dob}
              onChange={e => setProfile(prev => ({ ...prev, dob: e.target.value }))}
              style={styles.input}
            />
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            style={styles.saveButton}
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Addresses</h2>
        <Link to="/addresses" style={styles.manageButton}>
          Manage Addresses
        </Link>
      </div>
    </main>
  )
}

const styles = {
  card: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    marginBottom: "30px"
  },
  avatarSection: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    marginBottom: "30px"
  },
  avatar: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    objectFit: "cover" as const,
    marginBottom: "12px"
  },
  avatarPlaceholder: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    backgroundColor: "#222",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "48px",
    fontWeight: 700,
    marginBottom: "12px"
  },
  uploadLabel: {
    color: "#666",
    fontSize: "14px",
    cursor: "pointer",
    textDecoration: "underline"
  },
  fileInput: {
    display: "none"
  },
  uploadHint: {
    fontSize: "12px",
    color: "#888",
    marginTop: "4px"
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
  saveButton: {
    padding: "12px 24px",
    backgroundColor: "#222",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: 600,
    justifySelf: "start" as const
  },
  section: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
  },
  sectionTitle: {
    margin: "0 0 16px",
    fontSize: "20px"
  },
  manageButton: {
    display: "inline-block",
    padding: "10px 20px",
    backgroundColor: "#222",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "6px",
    fontSize: "14px"
  }
}

export default ProfilePage
