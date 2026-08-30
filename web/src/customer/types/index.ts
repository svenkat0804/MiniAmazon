export type Product = {
  id: number
  name: string
  description: string
  price: number
  stock: number
  is_active: boolean
  created_at: string
  category_id: number
  category_name: string
  image?: string
  image_url?: string | null
}

export type CartItem = Product & {
  quantity: number
}

export type Address = {
  id: number
  name: string
  phone: string
  addressLine: string
  city: string
  state: string
  pincode: string
  isDefault: boolean
}

export type PaymentMethod =
  | "COD"
  | "UPI"
  | "CREDIT_CARD"
  | "DEBIT_CARD"

export type OrderStatus =
  | "PLACED"
  | "CONFIRMED"
  | "SHIPPED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"

export type TrackingStep =
  | "PLACED"
  | "CONFIRMED"
  | "SHIPPED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"

export interface TrackingInfo {
  currentStatus: OrderStatus
  steps: {
    status: TrackingStep
    label: string
    description: string
    completed: boolean
    active: boolean
  }[]
}

export interface Order {
  id: string
  items: CartItem[]
  address: Address
  paymentMethod: PaymentMethod
  paymentStatus: "SUCCESS" | "FAILED"
  orderStatus: OrderStatus
  total: number
  createdAt: string
  tracking?: TrackingInfo
}