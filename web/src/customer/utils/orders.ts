import type {
  Order
} from "../types"

const ORDERS_KEY =
  "mini-amazon-orders"

export function getOrders(): Order[] {

  const data =
    localStorage.getItem(
      ORDERS_KEY
    )

  if (!data) {
    return []
  }

  try {
    return JSON.parse(data)
  } catch {
    return []
  }
}

export function saveOrder(
  order: Order
) {

  const orders =
    getOrders()

  orders.unshift(order)

  localStorage.setItem(
    ORDERS_KEY,
    JSON.stringify(orders)
  )
}