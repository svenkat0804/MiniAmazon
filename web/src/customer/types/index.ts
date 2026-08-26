export type Product = {
  id: number
  name: string
  price: number
  image: string
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

export type Order = {
  id: string
  items: CartItem[]
  address: Address
  paymentMethod: PaymentMethod
  paymentStatus: "SUCCESS" | "FAILED"
  orderStatus: "PLACED"
  total: number
  createdAt: string
}