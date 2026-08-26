import {
  useState
} from "react"

import {
  useNavigate
} from "react-router-dom"

import {
  useCart
} from "../context/CartContext"

import {
  saveOrder
} from "../utils/orders"

import type {
  Address,
  PaymentMethod
} from "../types"

function PaymentPage() {

  const navigate =
    useNavigate()

  const {
    cart,
    cartTotal,
    clearCart
  } = useCart()

  const [
    paymentMethod,
    setPaymentMethod
  ] =
    useState<PaymentMethod>("COD")

  const [
    processing,
    setProcessing
  ] =
    useState(false)

  const addressData =
    localStorage.getItem(
      "selectedAddress"
    )

  const address: Address | null =
    addressData
      ? JSON.parse(addressData)
      : null

  const confirmOrder =
    async () => {

      if (!address) {

        navigate("/address")

        return
      }

      if (cart.length === 0) {

        navigate("/cart")

        return
      }

      setProcessing(true)

      /*
       * COD
       */
      if (
        paymentMethod === "COD"
      ) {

        const order = {
          id: `ORD-${Date.now()}`,
          items: cart,
          address: address,
          paymentMethod:
            paymentMethod,
          paymentStatus:
            "SUCCESS" as const,
          orderStatus:
            "PLACED" as const,
          total: cartTotal,
          createdAt:
            new Date().toISOString()
        }

        saveOrder(order)

        // IMPORTANT
        // Order success -> clear cart
        clearCart()

        setProcessing(false)

        navigate(
          `/order-success/${order.id}`
        )

        return
      }

      /*
       * Simulated online payment
       */
      await new Promise(
        resolve =>
          setTimeout(
            resolve,
            2000
          )
      )

      const paymentSuccess =
        Math.random() > 0.3

      if (!paymentSuccess) {

        setProcessing(false)

        alert(
          "Payment failed. Your cart has not been cleared."
        )

        return
      }

      /*
       * Payment successful
       */
      const order = {
        id: `ORD-${Date.now()}`,
        items: cart,
        address: address,
        paymentMethod:
          paymentMethod,
        paymentStatus:
          "SUCCESS" as const,
        orderStatus:
          "PLACED" as const,
        total: cartTotal,
        createdAt:
          new Date().toISOString()
      }

      saveOrder(order)

      // ONLY after payment success
      clearCart()

      setProcessing(false)

      navigate(
        `/order-success/${order.id}`
      )
    }

  return (
    <main className="page-content">

      <h1>
        Payment
      </h1>

      {address && (

        <div className="checkout-section">

          <h2>
            Delivery Address
          </h2>

          <p>
            <strong>
              {address.name}
            </strong>
          </p>

          <p>
            {address.addressLine},
            {" "}
            {address.city},
            {" "}
            {address.state} -
            {" "}
            {address.pincode}
          </p>

        </div>

      )}

      <div className="checkout-section">

        <h2>
          Select Payment Method
        </h2>

        <label className="payment-option">

          <input
            type="radio"
            name="payment"
            checked={
              paymentMethod ===
              "COD"
            }
            onChange={() =>
              setPaymentMethod(
                "COD"
              )
            }
          />

          Cash on Delivery

        </label>

        <label className="payment-option">

          <input
            type="radio"
            name="payment"
            checked={
              paymentMethod ===
              "UPI"
            }
            onChange={() =>
              setPaymentMethod(
                "UPI"
              )
            }
          />

          UPI

        </label>

        <label className="payment-option">

          <input
            type="radio"
            name="payment"
            checked={
              paymentMethod ===
              "CREDIT_CARD"
            }
            onChange={() =>
              setPaymentMethod(
                "CREDIT_CARD"
              )
            }
          />

          Credit Card

        </label>

        <label className="payment-option">

          <input
            type="radio"
            name="payment"
            checked={
              paymentMethod ===
              "DEBIT_CARD"
            }
            onChange={() =>
              setPaymentMethod(
                "DEBIT_CARD"
              )
            }
          />

          Debit Card

        </label>

      </div>

      <div className="checkout-total">

        <h2>
          Total: ₹
          {cartTotal.toLocaleString(
            "en-IN"
          )}
        </h2>

        <button
          className="primary-button"
          disabled={processing}
          onClick={
            confirmOrder
          }
        >
          {processing
            ? "Processing..."
            : "Confirm Order"}
        </button>

      </div>

    </main>
  )
}

export default PaymentPage