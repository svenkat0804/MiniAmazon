import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from "react"

import type {
  Product
} from "../data/products"


/* ========================================
   CART ITEM
======================================== */

export type CartItem = Product & {
  quantity: number
}


/* ========================================
   CONTEXT TYPE
======================================== */

type CartContextType = {

  cart: CartItem[]

  cartCount: number

  cartTotal: number

  addToCart: (
    product: Product
  ) => void

  removeFromCart: (
    productId: number
  ) => void

  increaseQuantity: (
    productId: number
  ) => void

  decreaseQuantity: (
    productId: number
  ) => void

  clearCart: () => void
}


/* ========================================
   CREATE CONTEXT
======================================== */

const CartContext =
  createContext<
    CartContextType | undefined
  >(undefined)


/* ========================================
   PROVIDER
======================================== */

type CartProviderProps = {
  children: ReactNode
}


export function CartProvider({
  children
}: CartProviderProps) {

  const [cart, setCart] =
    useState<CartItem[]>(() => {

      try {

        const savedCart =
          localStorage.getItem(
            "mini-amazon-cart"
          )

        if (savedCart) {

          return JSON.parse(
            savedCart
          )

        }

      } catch (error) {

        console.error(
          "Failed to load cart:",
          error
        )

      }

      return []

    })


  /* ========================================
     SAVE CART TO LOCAL STORAGE
  ======================================== */

  useEffect(() => {

    localStorage.setItem(
      "mini-amazon-cart",
      JSON.stringify(cart)
    )

  }, [cart])


  /* ========================================
     ADD TO CART
  ======================================== */

  const addToCart = (product: Product) => {
  setCart((currentCart) => {

    const existingProductIndex =
      currentCart.findIndex(
        (item) => item.id === product.id
      )

    // Same product → increase quantity
    if (existingProductIndex !== -1) {

      return currentCart.map((item, index) => {

        if (index === existingProductIndex) {
          return {
            ...item,
            quantity: item.quantity + 1
          }
        }

        return item
      })
    }

    // New product → add with quantity 1
    return [
      ...currentCart,
      {
        ...product,
        quantity: 1
      }
    ]
  })
}

  /* ========================================
     REMOVE PRODUCT
  ======================================== */

  const removeFromCart = (
    productId: number
  ) => {

    setCart(currentCart =>
      currentCart.filter(
        item =>
          item.id !== productId
      )
    )

  }


  /* ========================================
     INCREASE
  ======================================== */

  const increaseQuantity = (productId: number) => {

  setCart((currentCart) => {

    return currentCart.map((item) => {

      if (item.id === productId) {

        return {
          ...item,
          quantity: item.quantity + 1
        }

      }

      return item
    })
  })
}


  /* ========================================
     DECREASE
  ======================================== */

  const decreaseQuantity = (productId: number) => {

  setCart((currentCart) => {

    return currentCart
      .map((item) => {

        if (item.id === productId) {

          return {
            ...item,
            quantity: item.quantity - 1
          }

        }

        return item
      })
      .filter((item) => item.quantity > 0)
  })
}


  /* ========================================
     CLEAR CART
  ======================================== */

  const clearCart = () => {

    setCart([])

  }


  /* ========================================
     CART COUNT
  ======================================== */

  const cartCount =
    cart.reduce(
      (
        total,
        item
      ) =>
        total + item.quantity,
      0
    )


  /* ========================================
     CART TOTAL
  ======================================== */

  const cartTotal =
    cart.reduce(
      (
        total,
        item
      ) =>
        total +
        item.price *
        item.quantity,
      0
    )


  return (

    <CartContext.Provider
      value={{

        cart,

        cartCount,

        cartTotal,

        addToCart,

        removeFromCart,

        increaseQuantity,

        decreaseQuantity,

        clearCart

      }}
    >

      {children}

    </CartContext.Provider>

  )

}


/* ========================================
   HOOK
======================================== */

export function useCart() {

  const context =
    useContext(CartContext)


  if (!context) {

    throw new Error(
      "useCart must be used inside CartProvider"
    )

  }


  return context

}