import type {
  Order,
  OrderStatus,
  TrackingInfo
} from "../types"

type BackendOrder = {
  id: number
  items: unknown[]
  customer_name: string
  customer_phone: string
  shipping_address: string
  shipping_city: string
  shipping_state: string
  shipping_pincode: string
  subtotal: number
  shipping_cost: number
  total: number
  payment_method: string
  payment_status: string
  order_status: string
  created_at: string
}

const ORDERS_KEY =
  "mini-amazon-orders"

const TRACKING_STEPS: { status: OrderStatus; label: string; description: string }[] = [
  { status: "PLACED", label: "Order Placed", description: "Your order has been placed successfully" },
  { status: "CONFIRMED", label: "Confirmed", description: "Seller has confirmed your order" },
  { status: "SHIPPED", label: "Shipped", description: "Your order has been shipped" },
  { status: "OUT_FOR_DELIVERY", label: "Out for Delivery", description: "Your order is out for delivery" },
  { status: "DELIVERED", label: "Delivered", description: "Your order has been delivered" }
]

function buildTracking(currentStatus: OrderStatus): TrackingInfo {
  const currentIndex = TRACKING_STEPS.findIndex(step => step.status === currentStatus)
  return {
    currentStatus,
    steps: TRACKING_STEPS.map((step, index) => ({
      status: step.status,
      label: step.label,
      description: step.description,
      completed: index < currentIndex,
      active: index === currentIndex
    }))
  }
}

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

export async function saveOrder(
  order: Order
) {

  const orders =
    getOrders()

  const orderWithTracking = {
    ...order,
    tracking: buildTracking(order.orderStatus)
  }

  orders.unshift(orderWithTracking)

  localStorage.setItem(
    ORDERS_KEY,
    JSON.stringify(orders)
  )

  try {
    const userData = localStorage.getItem("mini-amazon-user")
    const user = userData ? JSON.parse(userData) : null

    const shippingAddress = order.address?.addressLine || ""
    const shippingCity = order.address?.city || ""
    const shippingState = order.address?.state || ""
    const shippingPincode = order.address?.pincode || ""

    const subtotal = order.total
    const shippingCost = subtotal > 999 ? 0 : 99

    await fetch("http://localhost:5001/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        customer_name: user?.name || "Guest",
        customer_email: user?.email || "guest@example.com",
        customer_phone: order.address?.phone || null,
        shipping_address: shippingAddress,
        shipping_city: shippingCity,
        shipping_state: shippingState,
        shipping_pincode: shippingPincode,
        items: order.items,
        subtotal: subtotal,
        shipping_cost: shippingCost,
        total: subtotal + shippingCost,
        payment_method: order.paymentMethod,
        payment_status: order.paymentStatus,
        order_status: order.orderStatus
      })
    })

  } catch (error) {
    console.error("Failed to save order to backend:", error)
  }
}

export async function getBackendOrders(): Promise<Order[]> {
  try {
    const userData = localStorage.getItem("mini-amazon-user")
    const user = userData ? JSON.parse(userData) : null

    if (!user?.email) {
      return getOrders()
    }

    const response = await fetch(
      `http://localhost:5001/api/orders/customer/${encodeURIComponent(user.email)}`
    )

    if (!response.ok) {
      throw new Error("Failed to fetch orders from backend")
    }

    const data = await response.json()

    return (data.orders || []).map((order: BackendOrder) => ({
      id: String(order.id),
      items: order.items || [],
      address: {
        id: 0,
        name: order.customer_name,
        phone: order.customer_phone || "",
        addressLine: order.shipping_address || "",
        city: order.shipping_city || "",
        state: order.shipping_state || "",
        pincode: order.shipping_pincode || "",
        isDefault: true
      },
      paymentMethod: order.payment_method,
      paymentStatus: order.payment_status,
      orderStatus: order.order_status,
      total: Number(order.total),
      createdAt: order.created_at,
      tracking: buildTracking(order.order_status as OrderStatus)
    }))

  } catch (error) {
    console.error("Error fetching backend orders:", error)
    return getOrders()
  }
}

export function getOrderById(
  orderId: string
): Order | undefined {

  return getOrders().find(
    order => order.id === orderId
  )
}
