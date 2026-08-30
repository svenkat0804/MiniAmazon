import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import { Link } from "react-router-dom"
import { getSiteSettings, getUnreadNotificationCount } from "../api/customerApi"

type HeaderProps = {
  searchText: string
  onSearchChange: (value: string) => void
  onCartClick: () => void
  onLoginClick: () => void
  onLogoutClick: () => void
  cartCount?: number
}

function Header({
  searchText,
  onSearchChange,
  onCartClick,
  onLoginClick,
  onLogoutClick,
  cartCount = 0
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const isLoggedIn = typeof window !== "undefined" && !!localStorage.getItem("mini-amazon-user")
  const [profileImage, setProfileImage] = useState("")
  const [logoUrl, setLogoUrl] = useState("")
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    async function loadLogo() {
      try {
        const data = await getSiteSettings() as { settings: Record<string, string> }
        if (data.settings?.logo_url) {
          setLogoUrl(data.settings.logo_url)
        }
      } catch (err) {
        console.error("Load logo error:", err)
      }
    }
    loadLogo()
  }, [])

  useEffect(() => {
    async function loadUnreadCount() {
      try {
        const userData = localStorage.getItem("mini-amazon-user")
        if (userData) {
          const user = JSON.parse(userData)
          const data = await getUnreadNotificationCount("customer", user.id) as { count: number }
          setUnreadCount(data.count)
        }
      } catch (err) {
        console.error("Load unread count error:", err)
      }
    }
    loadUnreadCount()
  }, [])

  useEffect(() => {
    function loadProfile() {
      try {
        const saved = localStorage.getItem("mini-amazon-profile")
        if (saved) {
          const profile = JSON.parse(saved)
          if (profile.image) {
            setProfileImage(profile.image)
          }
        }
      } catch (err) {
        console.error("Load profile error:", err)
      }
    }
    loadProfile()
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node
      const dropdown = document.querySelector(".header-menu-dropdown")
      const trigger = triggerRef.current
      if (dropdown && !dropdown.contains(target) && trigger && !trigger.contains(target)) {
        setMenuOpen(false)
        setCoords(null)
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false)
        setCoords(null)
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleEscape)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [menuOpen])

  const openMenu = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setCoords({
        top: rect.bottom + 8,
        left: rect.left
      })
    }
    setMenuOpen(true)
  }

  const closeMenu = () => {
    setMenuOpen(false)
    setCoords(null)
  }

  return (
    <header className="site-header">

      {/* NAVIGATION */}
      <nav className="header-nav">
        <div className="nav-container">
          <div className="nav-left">
          <Link to="/" className="nav-logo" onClick={() => onSearchChange("")}>
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="DentalKart"
                className="logo-image"
              />
            ) : (
              <>
                <span className="logo-icon">🦷</span>
                <span className="logo-text">DentalKart</span>
              </>
            )}
          </Link>
            <div className="header-menu-wrapper">
              <button
                ref={triggerRef}
                type="button"
                className="header-menu-trigger"
                onClick={openMenu}
              >
                <span className="menu-icon">☰</span>
              </button>
            </div>
          </div>

          <div className="nav-center">
            <div className={`header-search${searchText.length > 0 ? " has-value" : ""}`}>
              <span className="search-icon" aria-hidden="true">
                🔍
              </span>
              <input
                type="text"
                value={searchText}
                onChange={(event) =>
                  onSearchChange(event.target.value)
                }
                placeholder="Search 20,000+ dental products..."
              />
              {searchText.length > 0 && (
                <button
                  type="button"
                  className="search-clear"
                  onClick={() => onSearchChange("")}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          <div className="nav-right">
            {isLoggedIn && (
              <Link to="/notifications" className="header-notification">
                <span className="notification-icon">🔔</span>
                {unreadCount > 0 && (
                  <span className="notification-badge">{unreadCount}</span>
                )}
              </Link>
            )}
            {isLoggedIn ? (
              <div className="profile-container">
                <Link to="/profile" className="header-profile">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="profile-image"
                    />
                  ) : (
                    <span className="profile-placeholder">👤</span>
                  )}
                </Link>
                <button
                  type="button"
                  className="header-auth"
                  onClick={onLogoutClick}
                >
                  <span className="auth-label">Logout</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="header-auth"
                onClick={onLoginClick}
              >
                <span className="auth-icon">👤</span>
                <span className="auth-label">Login</span>
              </button>
            )}

            <button
              type="button"
              className="header-cart"
              onClick={onCartClick}
            >
              <span className="cart-icon-wrap">🛒</span>
              {cartCount > 0 && (
                <span className="cart-badge">{cartCount}</span>
              )}
              <span className="cart-text">Cart</span>
            </button>
          </div>
        </div>
      </nav>

      {menuOpen && coords && createPortal(
        <div className="header-menu-dropdown" style={{ top: coords.top, left: coords.left, position: "fixed" }}>
          {isLoggedIn && (
            <Link to="/profile" className="header-menu-item" onClick={closeMenu}>👤 Profile</Link>
          )}
          {isLoggedIn && (
            <Link to="/orders" className="header-menu-item" onClick={closeMenu}>📋 View Orders</Link>
          )}
          <Link to="/about" className="header-menu-item" onClick={closeMenu}>ℹ️ About Us</Link>
          <Link to="/contact" className="header-menu-item" onClick={closeMenu}>📞 Contact Us</Link>
          <Link to="/support" className="header-menu-item" onClick={closeMenu}>💬 Support</Link>
          <Link to="/terms" className="header-menu-item" onClick={closeMenu}>📄 Terms</Link>
          <Link to="/privacy" className="header-menu-item" onClick={closeMenu}>🔒 Privacy</Link>
          <Link to="/refund" className="header-menu-item" onClick={closeMenu}>💰 Refund Policy</Link>
        </div>,
        document.body
      )}

    </header>
  )
}

export default Header
