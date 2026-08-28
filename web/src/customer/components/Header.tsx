import { Link } from "react-router-dom"

type HeaderProps = {
  searchText: string
  onSearchChange: (value: string) => void
  onCartClick: () => void
  onLoginClick: () => void
  cartCount?: number
}

function Header({
  searchText,
  onSearchChange,
  onCartClick,
  onLoginClick,
  cartCount = 0
}: HeaderProps) {

  return (
    <header className="site-header">

      {/* TOP UTILITY BAR */}

      <div className="header-utility">

        <div className="header-container utility-container">

          <div className="utility-left">

            <span className="support-badge">
              <span className="support-icon">🎧</span>
              <span className="support-text">
                <span className="support-label">Need Help?</span>
                <a className="support-number" href="tel:+917289999456">+91 728-9999-456</a>
              </span>
            </span>

          </div>


          <div className="utility-right">

            <a className="utility-link" href="#">Track Order</a>

            <span className="utility-divider" aria-hidden="true" />

            <a className="utility-link" href="#">Support</a>

            <span className="utility-divider" aria-hidden="true" />

            <a className="utility-link" href="#">Login / Signup</a>

            <span className="utility-divider" aria-hidden="true" />

            <a className="utility-link" href="#">Wishlist</a>

          </div>

        </div>

      </div>


      {/* MAIN HEADER */}

      <div className="header-main">

        <div className="header-container main-container">

          <div className="header-left">

            <Link to="/" className="header-logo" onClick={() => onSearchChange("")}>
              <span className="logo-icon">🦷</span>
              <span className="logo-text">DentalKart</span>
            </Link>

            <div className="delivery-badge">

              <span className="delivery-icon">📍</span>

              <div className="delivery-text">

                <span className="delivery-label">Deliver to</span>

                <button type="button" className="pincode-button">
                  <span>Enter Pincode</span>
                  <span className="pincode-arrow">›</span>
                </button>

              </div>

            </div>

          </div>


          <div className="header-center">

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


          <div className="header-right">

            <button
              type="button"
              className="header-login"
              onClick={onLoginClick}
            >
              <span className="header-icon">👤</span>
              <span className="header-label">Account</span>
            </button>

            <button
              type="button"
              className="header-cart"
              onClick={onCartClick}
            >
              <span className="cart-icon-wrap">
                🛒
                {cartCount > 0 && (
                  <span className="cart-badge">{cartCount}</span>
                )}
              </span>

              <span className="cart-text">
                Cart
              </span>
            </button>

          </div>

        </div>

      </div>


      {/* NAVIGATION */}

      <nav className="header-nav">

        <div className="header-container nav-container">

          <div className="nav-links">

            <Link to="/" className="nav-link">Category</Link>
            <Link to="/" className="nav-link">About Us</Link>
            <Link to="/" className="nav-link">Brand</Link>
            <Link to="/" className="nav-link">Freebies</Link>
            <Link to="/" className="nav-link">Best Sellers</Link>
            <Link to="/" className="nav-link">Offers</Link>
            <Link to="/" className="nav-link">New Arrivals</Link>
            <Link to="/" className="nav-link">Membership</Link>
            <Link to="/" className="nav-link">Events</Link>
            <Link to="/" className="nav-link">New Clinic Setup</Link>

          </div>

        </div>

      </nav>

    </header>
  )
}

export default Header
