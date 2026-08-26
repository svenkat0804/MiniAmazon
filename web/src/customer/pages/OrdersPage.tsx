import {
  Link
} from "react-router-dom"

import {
  getOrders
} from "../utils/orders"

function OrdersPage() {

  const orders =
    getOrders()

  return (
    <main className="page-content">

      <h1>
        My Orders
      </h1>

      {orders.length === 0 ? (

        <div className="empty-message">

          <p>
            No orders found.
          </p>

          <Link
            to="/"
            className="primary-button"
          >
            Start Shopping
          </Link>

        </div>

      ) : (

        <div className="orders-list">

          {orders.map(order => (

            <div
              className="order-card"
              key={order.id}
            >

              <div className="order-header">

                <h2>
                  {order.id}
                </h2>

                <span className="order-status">
                  {order.orderStatus}
                </span>

              </div>

              {order.items.map(
                item => (

                  <div
                    className="order-item"
                    key={item.id}
                  >

                    <span>
                      {item.name}
                    </span>

                    <span>
                      × {item.quantity}
                    </span>

                  </div>

                )
              )}

              <hr />

              <p>
                Payment:{" "}
                {order.paymentMethod}
              </p>

              <h3>
                Total: ₹
                {order.total.toLocaleString(
                  "en-IN"
                )}
              </h3>

            </div>

          ))}

        </div>

      )}

    </main>
  )
}

export default OrdersPage