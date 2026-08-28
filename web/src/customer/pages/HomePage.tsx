import ProductCard from "../components/ProductCard"
import CategoryCard from "../components/CategoryCard"
import { products, categories } from "../data/products"

type HomePageProps = {
  searchText: string
  onProductAdded: (productName: string) => void
  onViewProduct: (productId: number) => void
}

function HomePage({
  searchText,
  onProductAdded,
  onViewProduct
}: HomePageProps) {

  const filteredProducts =
    products.filter((product) =>
      product.name
        .toLowerCase()
        .includes(searchText.toLowerCase())
    )

  const featuredCategories = categories.slice(0, 6)

  return (
    <div className="home-page">

      {/* HERO BANNER */}

      <section className="hero-banner">
        <div className="hero-banner-content">

          <span className="hero-badge">🦷 Trusted by 50,000+ Dentists</span>

          <h1>Your Trusted Online Dental Store</h1>

          <p>
            Shop 20,000+ dental products from 450+ brands
          </p>

          <div className="hero-actions">

            <button
              type="button"
              className="hero-cta primary"
              onClick={() => {
                const el = document.getElementById("categories-section")
                if (el) {
                  el.scrollIntoView({ behavior: "smooth" })
                }
              }}
            >
              Shop Now
            </button>

            <button
              type="button"
              className="hero-cta secondary"
              onClick={() => {
                const el = document.getElementById("products-section")
                if (el) {
                  el.scrollIntoView({ behavior: "smooth" })
                }
              }}
            >
              View Products
            </button>

          </div>

          <div className="hero-trust">
            <span>✓ Free shipping over ₹999</span>
            <span>✓ 100% genuine products</span>
            <span>✓ Easy returns</span>
          </div>

        </div>
      </section>

      {/* STATS BAR */}

      <section className="stats-bar">
        <div className="stats-container">
          <div className="stat-item">
            <span className="stat-icon">📦</span>
            <span className="stat-number">20,000+</span>
            <span className="stat-label">Products</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">🏷️</span>
            <span className="stat-number">450+</span>
            <span className="stat-label">Trusted Brands</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">✅</span>
            <span className="stat-number">100%</span>
            <span className="stat-label">Original</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">💰</span>
            <span className="stat-number">Best</span>
            <span className="stat-label">Assured Prices</span>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}

      <section className="why-us-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Why Choose DentalKart?</h2>
          </div>
          <div className="why-us-grid">
            <div className="why-us-card">
              <span className="why-us-icon">🚚</span>
              <h3>Free Shipping</h3>
              <p>Free shipping on orders above ₹999 across India</p>
            </div>
            <div className="why-us-card">
              <span className="why-us-icon">🔒</span>
              <h3>100% Secure</h3>
              <p>All transactions are secured with SSL encryption</p>
            </div>
            <div className="why-us-card">
              <span className="why-us-icon">↩️</span>
              <h3>Easy Returns</h3>
              <p>7-day easy return policy on all products</p>
            </div>
            <div className="why-us-card">
              <span className="why-us-icon">💬</span>
              <h3>24/7 Support</h3>
              <p>Dedicated customer support anytime you need</p>
            </div>
          </div>
        </div>
      </section>

      {/* TOP CATEGORIES */}

      <section className="categories-section" id="categories-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Top Categories</h2>
            <button type="button" className="view-all-button">View All</button>
          </div>
          <div className="categories-grid">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onClick={() => {
                  const searchInput = document.querySelector(".header-search input") as HTMLInputElement | null
                  if (searchInput) {
                    searchInput.value = category.name
                    searchInput.dispatchEvent(new Event("input", { bubbles: true }))
                  }
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED CATEGORIES */}

      <section className="featured-categories">
        <div className="section-container">
          <div className="section-header">
            <h2>Featured Categories</h2>
          </div>
          <div className="featured-grid">
            {featuredCategories.map((category) => (
              <div
                key={category.id}
                className="featured-category-card"
                onClick={() => {
                  const searchInput = document.querySelector(".header-search input") as HTMLInputElement | null
                  if (searchInput) {
                    searchInput.value = category.name
                    searchInput.dispatchEvent(new Event("input", { bubbles: true }))
                  }
                }}
              >
                <img src={category.image} alt={category.name} />
                <span>{category.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ALL PRODUCTS */}

      <section className="all-products-section" id="products-section">
        <div className="section-container">
          <div className="products-header">
            <h1>All Products</h1>
            <span>
              {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="no-products">
              <h2>No products found</h2>
              <p>Try another search.</p>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAdded={() => onProductAdded(product.name)}
                  onViewDetails={() => onViewProduct(product.id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  )
}

export default HomePage
