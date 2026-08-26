import { useCart } from "../context/CartContext"

type CartPageProps = {
  onContinueShopping: () => void
  onCheckout: () => void
}

function CartPage({
  onContinueShopping,
  onCheckout
}: CartPageProps) {

  const {
    cart,
    cartTotal,
    increaseQuantity,
    decreaseQuantity
  } = useCart()


  if (cart.length === 0) {

    return (
      <div className="cart-page">

        <div className="cart-empty">

          <h1>
            Your Cart
          </h1>

          <p>
            Your cart is empty.
          </p>

          <button
            type="button"
            onClick={onContinueShopping}
          >
            Continue Shopping
          </button>

        </div>

      </div>
    )
  }


  return (

    <div className="cart-page">

      <div className="cart-container">

        <h1>
          Shopping Cart
        </h1>


        <div className="cart-content">

          {/* PRODUCTS */}

          <div className="cart-products">

            {cart.map((item) => (

              <div
                className="cart-item"
                key={item.id}
              >

                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-item-image"
                />


                <div className="cart-item-info">

                  <h2>
                    {item.name}
                  </h2>

                  <p className="cart-item-price">
                    ₹{item.price.toLocaleString("en-IN")}
                  </p>


                  <div className="quantity-control">

                    <button
                      type="button"
                      onClick={() =>
                        decreaseQuantity(item.id)
                      }
                    >
                      −
                    </button>


                    <span>
                      {item.quantity}
                    </span>


                    <button
                      type="button"
                      onClick={() =>
                        increaseQuantity(item.id)
                      }
                    >
                      +
                    </button>

                  </div>

                </div>


                <div className="cart-item-total">

                  ₹{(
                    item.price *
                    item.quantity
                  ).toLocaleString("en-IN")}

                </div>

              </div>

            ))}

          </div>


          {/* SUMMARY */}

          <aside className="cart-summary">

            <h2>
              Order Summary
            </h2>

            <div className="summary-row">

              <span>
                Total
              </span>

              <strong>
                ₹{cartTotal.toLocaleString("en-IN")}
              </strong>

            </div>


            <button
              type="button"
              className="checkout-button"
              onClick={onCheckout}
            >
              Place Order
            </button>


            <button
              type="button"
              className="continue-button"
              onClick={onContinueShopping}
            >
              Continue Shopping
            </button>

          </aside>

        </div>

      </div>

    </div>

  )
}

export default CartPage