import {
  Link,
  useParams
} from "react-router-dom"

function OrderSuccessPage() {

  const {
    orderId
  } = useParams()

  return (
    <main className="page-content">

      <div className="success-card">

        <div className="success-icon">
          ✓
        </div>

        <h1>
          Order Placed Successfully
        </h1>

        <p>
          Thank you for your order.
        </p>

        <p>
          Order ID:
          {" "}
          <strong>
            {orderId}
          </strong>
        </p>

        <div className="success-actions">

          <Link
            to="/orders"
            className="primary-button"
          >
            View Orders
          </Link>

          <Link
            to="/"
            className="secondary-button"
          >
            Continue Shopping
          </Link>

        </div>

      </div>

    </main>
  )
}

export default OrderSuccessPage