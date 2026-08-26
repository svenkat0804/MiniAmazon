import { useState } from "react"

type SignupPageProps = {
  onSignupSuccess: () => void
  onLoginClick: () => void
}

function SignupPage({
  onSignupSuccess,
  onLoginClick
}: SignupPageProps) {

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] =
    useState("")

  const [error, setError] = useState("")


  const handleSignup = () => {

    setError("")


    if (!name.trim()) {
      setError("Please enter your full name")
      return
    }


    if (!email.trim()) {
      setError("Please enter your email")
      return
    }


    if (!email.includes("@")) {
      setError("Please enter a valid email address")
      return
    }


    if (!password) {
      setError("Please enter a password")
      return
    }


    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters"
      )
      return
    }


    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }


    const user = {
      name: name.trim(),
      email: email.trim(),
      password: password
    }


    localStorage.setItem(
      "mini-amazon-user",
      JSON.stringify(user)
    )


    onSignupSuccess()
  }


  return (

    <div className="signup-page">

      <div className="signup-card">


        {/* Logo */}

        <div className="signup-logo">
          🛍️
        </div>


        {/* Title */}

        <h1>
          Create Account
        </h1>

        <p className="signup-subtitle">
          Create your Mini Amazon account
        </p>


        {/* Error */}

        {error && (

          <div className="signup-error">
            {error}
          </div>

        )}


        {/* Name */}

        <div className="signup-form-group">

          <label htmlFor="signup-name">
            Full Name
          </label>

          <input
            id="signup-name"
            type="text"
            value={name}
            placeholder="Enter your full name"
            autoComplete="name"
            onChange={(event) =>
              setName(event.target.value)
            }
          />

        </div>


        {/* Email */}

        <div className="signup-form-group">

          <label htmlFor="signup-email">
            Email
          </label>

          <input
            id="signup-email"
            type="email"
            value={email}
            placeholder="Enter your email"
            autoComplete="email"
            onChange={(event) =>
              setEmail(event.target.value)
            }
          />

        </div>


        {/* Password */}

        <div className="signup-form-group">

          <label htmlFor="signup-password">
            Password
          </label>

          <input
            id="signup-password"
            type="password"
            value={password}
            placeholder="Create a password"
            autoComplete="new-password"
            onChange={(event) =>
              setPassword(event.target.value)
            }
          />

        </div>


        {/* Confirm Password */}

        <div className="signup-form-group">

          <label htmlFor="signup-confirm-password">
            Confirm Password
          </label>

          <input
            id="signup-confirm-password"
            type="password"
            value={confirmPassword}
            placeholder="Confirm your password"
            autoComplete="new-password"
            onChange={(event) =>
              setConfirmPassword(event.target.value)
            }
          />

        </div>


        {/* Create Account */}

        <button
          type="button"
          className="signup-primary-button"
          onClick={handleSignup}
        >
          Create Account
        </button>


        {/* Login */}

        <div className="signup-login-section">

          <span>
            Already have an account?
          </span>

          <button
            type="button"
            className="signup-login-link"
            onClick={onLoginClick}
          >
            Login
          </button>

        </div>

      </div>

    </div>
  )
}

export default SignupPage