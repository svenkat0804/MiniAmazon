import { useState } from "react"
import { Link } from "react-router-dom"

function SupportPage() {

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setError("Please fill in all fields")
      return
    }

    try {
      setSubmitting(true)

      const response = await fetch("http://localhost:5001/api/admin/complaints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          customer_name: name.trim(),
          customer_email: email.trim(),
          subject: subject.trim(),
          message: message.trim()
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit complaint")
      }

      setSuccess(true)
      setName("")
      setEmail("")
      setSubject("")
      setMessage("")

    } catch (error) {

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      )

    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="page-content">

      <div className="support-container">

        <div className="support-header">

          <h1>
            Customer Support
          </h1>

          <p>
            Have a question or issue? Fill out the form below and our team will get back to you.
          </p>

        </div>

        {success && (
          <div className="support-success">

            <div className="success-icon">
              ✓
            </div>

            <h2>
              Complaint Submitted Successfully
            </h2>

            <p>
              Thank you for reaching out. Our support team will get back to you within 24 hours.
            </p>

            <Link
              to="/"
              className="primary-button"
            >
              Continue Shopping
            </Link>

          </div>
        )}

        {!success && (
          <div className="support-form-card">

            {error && (
              <div className="support-error">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              <div className="form-group">

                <label htmlFor="support-name">
                  Full Name
                </label>

                <input
                  id="support-name"
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="Enter your full name"
                  autoComplete="name"
                />

              </div>

              <div className="form-group">

                <label htmlFor="support-email">
                  Email Address
                </label>

                <input
                  id="support-email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="Enter your email address"
                  autoComplete="email"
                />

              </div>

              <div className="form-group">

                <label htmlFor="support-subject">
                  Subject
                </label>

                <input
                  id="support-subject"
                  type="text"
                  value={subject}
                  onChange={(event) =>
                    setSubject(event.target.value)
                  }
                  placeholder="What is this about?"
                />

              </div>

              <div className="form-group">

                <label htmlFor="support-message">
                  Message
                </label>

                <textarea
                  id="support-message"
                  value={message}
                  onChange={(event) =>
                    setMessage(event.target.value)
                  }
                  placeholder="Describe your issue or question in detail..."
                  rows={6}
                />

              </div>

              <button
                type="submit"
                className="support-submit-button"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Complaint"}
              </button>

            </form>

          </div>
        )}

      </div>

    </main>
  )
}

export default SupportPage
