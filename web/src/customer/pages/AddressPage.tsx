import {
  useNavigate
} from "react-router-dom"

import type {
  Address
} from "../types"

const addresses: Address[] = [

  {
    id: 1,
    name: "Venkatesh",
    phone: "9876543210",
    addressLine: "10, Main Road",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600001",
    isDefault: true
  },

  {
    id: 2,
    name: "Venkatesh",
    phone: "9876543210",
    addressLine: "20, Second Street",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600002",
    isDefault: false
  }

]

function AddressPage() {

  const navigate =
    useNavigate()

  const defaultAddress =
    addresses.find(
      address =>
        address.isDefault
    ) || addresses[0]

  const handleContinue =
    () => {

      localStorage.setItem(
        "selectedAddress",
        JSON.stringify(
          defaultAddress
        )
      )

      navigate("/payment")
    }

  return (
    <main className="page-content">

      <h1>
        Delivery Address
      </h1>

      <div className="address-card">

        <span className="default-badge">
          Default Address
        </span>

        <h2>
          {defaultAddress.name}
        </h2>

        <p>
          Phone:{" "}
          {defaultAddress.phone}
        </p>

        <p>
          {defaultAddress.addressLine}
          <br />
          {defaultAddress.city}
          <br />
          {defaultAddress.state}
          <br />
          {defaultAddress.pincode}
        </p>

        <button
          className="primary-button"
          onClick={
            handleContinue
          }
        >
          Use This Address
        </button>

      </div>

    </main>
  )
}

export default AddressPage