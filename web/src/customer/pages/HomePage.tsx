import { useState, useEffect, useMemo } from "react"
import ProductCard from "../components/ProductCard"
import CategoryCard from "../components/CategoryCard"
import { products as staticProducts, categories as staticCategories, type Category } from "../data/products"
import { customerGet } from "../api/customerApi"
import type { Product } from "../types"

type HomePageProps = {
  searchText: string
  onProductAdded: (productName: string) => void
  onViewProduct: (productId: number) => void
}

type SortOption = "default" | "price-low" | "price-high" | "name-asc" | "name-desc"

function HomePage({
  searchText,
  onProductAdded,
  onViewProduct
}: HomePageProps) {

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [priceMin, setPriceMin] = useState<string>("")
  const [priceMax, setPriceMax] = useState<string>("")
  const [sortBy, setSortBy] = useState<SortOption>("default")

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)

        const productsPromise = customerGet("/admin/products").then(res => res as { products: { id: number; name: string; description?: string; price: number; stock: number; is_active: boolean; created_at: string; category_id: number; category_name?: string }[] }).catch(() => ({ products: staticProducts }))
        const categoriesPromise = customerGet("/categories").then(res => res as { categories: { id: number; name: string }[] }).catch(() => ({ categories: staticCategories.map(c => ({ id: c.id, name: c.name })) }))

        const [productsRes, categoriesRes] = await Promise.all([productsPromise, categoriesPromise])

        if (productsRes.products && Array.isArray(productsRes.products)) {
          const apiProducts = productsRes.products.map((p: { id: number; name: string; description?: string; price: number; stock: number; is_active: boolean; created_at: string; category_id: number; category_name?: string }) => ({
            id: p.id,
            name: p.name,
            description: p.description || "",
            price: Number(p.price) || 0,
            stock: Number(p.stock) || 0,
            is_active: p.is_active ?? true,
            created_at: p.created_at || new Date().toISOString(),
            category_id: Number(p.category_id) || 0,
            category_name: p.category_name || "",
            image: staticProducts.find(sp => sp.id === p.id)?.image || `https://via.placeholder.com/400x400?text=${encodeURIComponent(p.name)}`
          }))
          setProducts(apiProducts)
        } else {
          setProducts(staticProducts)
        }

        if (categoriesRes.categories && Array.isArray(categoriesRes.categories)) {
          const apiCategories = categoriesRes.categories.map((c: { id: number; name: string }) => ({
            id: c.id,
            name: c.name,
            icon: staticCategories.find(sc => sc.id === c.id)?.icon || "📦",
            image: staticCategories.find(sc => sc.id === c.id)?.image || `https://via.placeholder.com/400x300?text=${encodeURIComponent(c.name)}`
          }))
          setCategories(apiCategories)
        } else {
          setCategories(staticCategories)
        }
      } catch {
        setError("Failed to load data. Showing cached products.")
        setProducts(staticProducts)
        setCategories(staticCategories)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredAndSortedProducts = useMemo(() => {
    let result = products.filter((product) =>
      product.name
        .toLowerCase()
        .includes(searchText.toLowerCase())
    )

    if (selectedCategory) {
      result = result.filter((product) => product.category_name === selectedCategory)
    }

    if (priceMin !== "") {
      const min = Number(priceMin)
      if (!isNaN(min)) {
        result = result.filter((product) => product.price >= min)
      }
    }

    if (priceMax !== "") {
      const max = Number(priceMax)
      if (!isNaN(max)) {
        result = result.filter((product) => product.price <= max)
      }
    }

    switch (sortBy) {
      case "price-low":
        result = [...result].sort((a, b) => a.price - b.price)
        break
      case "price-high":
        result = [...result].sort((a, b) => b.price - a.price)
        break
      case "name-asc":
        result = [...result].sort((a, b) => a.name.localeCompare(b.name))
        break
      case "name-desc":
        result = [...result].sort((a, b) => b.name.localeCompare(a.name))
        break
      default:
        break
    }

    return result
  }, [products, searchText, selectedCategory, priceMin, priceMax, sortBy])

  const featuredCategories = categories.slice(0, 6)

  return (
    <div className="home-page">

      {/* ALL PRODUCTS */}

      <section className="all-products-section" id="products-section">
        <div className="section-container">
          <div className="products-header">
            <h1>All Products</h1>
            <div className="products-controls">
              <select
                className="filter-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                className="price-input"
                placeholder="Min ₹"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                min="0"
              />

              <input
                type="number"
                className="price-input"
                placeholder="Max ₹"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                min="0"
              />

              <select
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
              >
                <option value="default">Sort by: Default</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
                <option value="name-asc">Name: A → Z</option>
                <option value="name-desc">Name: Z → A</option>
              </select>
            </div>
          </div>

          <span className="products-count">
            {filteredAndSortedProducts.length} {filteredAndSortedProducts.length === 1 ? "product" : "products"}
          </span>

          {error && (
            <div className="api-error-banner">
              {error}
            </div>
          )}

          {loading ? (
            <div className="loading-products">
              <div className="loading-spinner" />
              <p>Loading products...</p>
            </div>
          ) : filteredAndSortedProducts.length === 0 ? (
            <div className="no-products">
              <h2>No products found</h2>
              <p>Try adjusting your filters or search.</p>
            </div>
          ) : (
            <div className="products-grid">
              {filteredAndSortedProducts.map((product) => (
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

    </div>
  )
}

export default HomePage
