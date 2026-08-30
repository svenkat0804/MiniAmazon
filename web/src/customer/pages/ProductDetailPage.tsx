import { useState, useEffect } from "react"
import { useCart } from "../context/CartContext"
import { customerGet } from "../api/customerApi"
import type { Product } from "../types"

type ProductDetailPageProps = {
  productId: number
  onBack: () => void
  onAdded: (productName: string) => void
}

function ProductDetailPage({
  productId,
  onBack,
  onAdded
}: ProductDetailPageProps) {

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { addToCart } = useCart()

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true)
        setError(null)
        const data = await customerGet(`/admin/products/${productId}`) as { product: { id: number; name: string; description?: string; price: number; stock: number; is_active: boolean; created_at: string; category_id: number; category_name?: string; image_url?: string | null } }
        const apiProduct = data.product
        if (apiProduct) {
          setProduct({
            id: apiProduct.id,
            name: apiProduct.name,
            description: apiProduct.description || "",
            price: Number(apiProduct.price) || 0,
            stock: Number(apiProduct.stock) || 0,
            is_active: apiProduct.is_active ?? true,
            created_at: apiProduct.created_at || new Date().toISOString(),
            category_id: Number(apiProduct.category_id) || 0,
            category_name: apiProduct.category_name || "",
            image: apiProduct.image_url || `https://via.placeholder.com/800x600?text=${encodeURIComponent(apiProduct.name)}`
          })
        }
      } catch {
        setError("Failed to load product details")
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [productId])

  const handleAddToCart = () => {
    if (product) {
      addToCart(product)
      onAdded(product.name)
    }
  }

  if (loading) {
    return (
      <div className="product-detail-page">
        <div className="loading-products">
          <div className="loading-spinner" />
          <p>Loading product...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="product-detail-page">
        <h1>
          {error || "Product not found"}
        </h1>
        <button
          type="button"
          onClick={onBack}
        >
          Back
        </button>
      </div>
    )
  }

  return (

    <div className="product-detail-page">

      <div className="product-detail-container">

        <button
          type="button"
          className="back-button"
          onClick={onBack}
        >
          ← Back to Products
        </button>


        <div className="product-detail-card">

          <div className="product-detail-image-container">

            <img
              src={product.image}
              alt={product.name}
              className="product-detail-image"
            />

          </div>


          <div className="product-detail-info">

            <p className="product-label">
              PRODUCT
            </p>

            <h1>
              {product.name}
            </h1>

            <div className="product-detail-price">
              ₹{product.price.toLocaleString("en-IN")}
            </div>

            <p className="product-description">
              {product.description}
            </p>


            <button
              type="button"
              className="detail-add-button"
              onClick={handleAddToCart}
            >
              🛒 Add to Cart
            </button>

          </div>

        </div>

      </div>

    </div>
  )
}

export default ProductDetailPage
