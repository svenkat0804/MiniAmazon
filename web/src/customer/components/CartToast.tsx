type CartToastProps = {
  productName: string
  onViewCart: () => void
  onClose: () => void
}

function CartToast({
  productName,
  onViewCart,
  onClose
}: CartToastProps) {

  return (
    <div className="cart-toast">

      <div className="toast-icon">
        ✓
      </div>

      <div className="toast-content">

        <strong>
          Added to cart
        </strong>

        <span>
          {productName}
        </span>

      </div>

      <button
        type="button"
        className="toast-cart-button"
        onClick={onViewCart}
      >
        View Cart
      </button>

      <button
        type="button"
        className="toast-close"
        onClick={onClose}
        aria-label="Close"
      >
        ×
      </button>

    </div>
  )
}

export default CartToast