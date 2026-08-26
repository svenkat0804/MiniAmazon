import { useCart } from "../context/CartContext"

import type { Product } from "../data/products"


type ProductCardProps = {
  product: Product
  onAdded: () => void
  onViewDetails: () => void
}


function ProductCard({
  product,
  onAdded,
  onViewDetails
}: ProductCardProps) {

  const { addToCart } = useCart()


  const handleAddToCart = () => {

    addToCart(product)

    onAdded()
  }


  return (

    <article className="product-card">

      <button
        type="button"
        className="product-image-button"
        onClick={onViewDetails}
      >

        <img
          src={product.image}
          alt={product.name}
          className="product-image"
        />

      </button>


      <div className="product-info">

        <h2>
          {product.name}
        </h2>

        <p className="product-price">
          ₹{product.price.toLocaleString("en-IN")}
        </p>


        <button
          type="button"
          className="view-product-button"
          onClick={onViewDetails}
        >
          View Details
        </button>


        <button
          type="button"
          className="add-cart-button"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>

      </div>

    </article>
  )
}

export default ProductCard