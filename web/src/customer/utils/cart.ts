import type { CartItem, Product } from "../types"

const CART_KEY = "mini-amazon-cart"

export function getCart(): CartItem[] {
  const storedCart = localStorage.getItem(CART_KEY)

  if (!storedCart) {
    return []
  }

  try {
    return JSON.parse(storedCart)
  } catch {
    return []
  }
}

export function saveCart(cart: CartItem[]) {
  localStorage.setItem(
    CART_KEY,
    JSON.stringify(cart)
  )
}

export function addProductToCart(
  product: Product
): CartItem[] {

  const cart = getCart()

  const existingItem = cart.find(
    item => item.id === product.id
  )

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({
      ...product,
      quantity: 1
    })
  }

  saveCart(cart)

  return cart
}

export function removeProductFromCart(
  productId: number
): CartItem[] {

  const cart = getCart()

  const updatedCart = cart.filter(
    item => item.id !== productId
  )

  saveCart(updatedCart)

  return updatedCart
}

export function updateProductQuantity(
  productId: number,
  quantity: number
): CartItem[] {

  const cart = getCart()

  const updatedCart = cart
    .map(item =>
      item.id === productId
        ? {
            ...item,
            quantity
          }
        : item
    )
    .filter(item => item.quantity > 0)

  saveCart(updatedCart)

  return updatedCart
}

export function clearCart() {
  localStorage.removeItem(CART_KEY)
}