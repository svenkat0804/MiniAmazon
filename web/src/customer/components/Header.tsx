type HeaderProps = {
  searchText: string
  onSearchChange: (value: string) => void
  onCartClick: () => void
  onLoginClick: () => void
}

function Header({
  searchText,
  onSearchChange,
  onCartClick,
  onLoginClick
}: HeaderProps) {

  return (
    <header className="site-header">

      <div className="header-container">

        {/* LEFT - LOGO */}

        <div className="header-left">

          <button
            type="button"
            className="header-logo"
            onClick={() => onSearchChange("")}
          >
            Mini Amazon
          </button>

        </div>


        {/* CENTER - SEARCH */}

        <div className="header-center">

          <div className="header-search">

            <input
              type="text"
              value={searchText}
              onChange={(event) =>
                onSearchChange(event.target.value)
              }
              placeholder="Search products..."
            />

            {searchText.length > 0 && (

              <button
                type="button"
                className="search-clear"
                onClick={() => onSearchChange("")}
              >
                ×
              </button>

            )}

          </div>

        </div>


        {/* RIGHT - ACTIONS */}

        <div className="header-right">

          <button
            type="button"
            className="header-login"
            onClick={onLoginClick}
          >
            Login
          </button>

          <button
            type="button"
            className="header-cart"
            onClick={onCartClick}
          >
            <span className="cart-icon">
              🛒
            </span>

            <span>
              Cart
            </span>
          </button>

        </div>

      </div>

    </header>
  )
}

export default Header