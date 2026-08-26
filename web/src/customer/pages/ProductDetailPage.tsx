import { products } from "../data/products"

import { useCart } from "../context/CartContext"

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

  const { addToCart } = useCart()


  const product = products.find(
    (item) => item.id === productId
  )


  if (!product) {

    return (

      <div className="product-detail-page">

        <h1>
          Product not found
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


  const handleAddToCart = () => {

    addToCart(product)

    onAdded(product.name)
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
              High quality product with excellent
              performance and value.
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