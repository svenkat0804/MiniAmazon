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

  const featuredProducts = products.slice(0, 4)

  return (
    <div className="home-page">

      {/* =========================
          HERO
      ========================= */}

      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Mini Amazon</h1>
          <p>Discover amazing products at unbeatable prices</p>
          <button
            type="button"
            className="hero-cta"
            onClick={() => {
              const el = document.getElementById("products-section")
              if (el) {
                el.scrollIntoView({ behavior: "smooth" })
              }
            }}
          >
            Shop Now
          </button>
        </div>
      </section>

      {/* =========================
          CATEGORIES
      ========================= */}

      <section className="categories-section">
        <div className="section-container">
          <h2>Shop by Category</h2>
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

      {/* =========================
          FEATURED PRODUCTS
      ========================= */}

      <section className="featured-section">
        <div className="section-container">
          <h2>Featured Products</h2>
          <div className="products-grid">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAdded={() => onProductAdded(product.name)}
                onViewDetails={() => onViewProduct(product.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* =========================
          ALL PRODUCTS
      ========================= */}

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
