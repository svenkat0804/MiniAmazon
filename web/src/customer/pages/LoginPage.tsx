import { useState } from "react"

type LoginPageProps = {
  onLoginSuccess: () => void
  onSignupClick: () => void
}

function LoginPage({
  onLoginSuccess,
  onSignupClick
}: LoginPageProps) {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = () => {

    if (!email.trim() || !password.trim()) {
      alert("Please enter email and password")
      return
    }

    localStorage.setItem(
      "mini-amazon-user",
      JSON.stringify({
        email: email.trim()
      })
    )

    onLoginSuccess()
  }

  return (
    <div className="login-page">

      <div className="login-card">

        <div className="login-logo">
          🛍️
        </div>

        <h1>Welcome Back</h1>

        <p className="login-subtitle">
          Login to continue shopping
        </p>

        <div className="form-group">

          <label>Email</label>

          <input
            type="email"
            value={email}
            placeholder="Enter your email"
            onChange={(event) =>
              setEmail(event.target.value)
            }
          />

        </div>

        <div className="form-group">

          <label>Password</label>

          <input
            type="password"
            value={password}
            placeholder="Enter your password"
            onChange={(event) =>
              setPassword(event.target.value)
            }
          />

        </div>

        <button
  type="button"
  className="login-button"
  onClick={handleLogin}
>
  Login
</button>

<div className="signup-section">
  <span>Don't have an account?</span>

  <button
    type="button"
    className="signup-link"
    onClick={onSignupClick}
  >
    Create Account
  </button>
</div>

      </div>

    </div>
  )
}

export default LoginPage