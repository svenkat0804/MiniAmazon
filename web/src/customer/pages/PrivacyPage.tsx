import { Link } from "react-router-dom"

function PrivacyPage() {
  return (
    <main className="page-content">
      <h1>Privacy Policy</h1>

      <div style={styles.card}>
        <h2 style={styles.title}>Your Privacy Matters</h2>
        <p style={styles.text}>
          At DentalKart, we are committed to protecting your personal information and your right to privacy.
        </p>

        <h3 style={styles.subtitle}>Information We Collect</h3>
        <p style={styles.text}>
          We collect information you provide directly to us, such as your name, email, phone number, and address
          when you create an account or place an order.
        </p>

        <h3 style={styles.subtitle}>How We Use Your Information</h3>
        <p style={styles.text}>
          We use the information we collect to process your orders, communicate with you about your orders,
          improve our services, and send you promotional offers (with your consent).
        </p>

        <h3 style={styles.subtitle}>Data Security</h3>
        <p style={styles.text}>
          We implement appropriate technical and organizational measures to protect your personal data against
          unauthorized access, alteration, disclosure, or destruction.
        </p>

        <h3 style={styles.subtitle}>Cookies</h3>
        <p style={styles.text}>
          We use cookies to enhance your browsing experience. You can set your browser to refuse all or some
          browser cookies, but this may affect your ability to use our website.
        </p>

        <h3 style={styles.subtitle}>Contact Us</h3>
        <p style={styles.text}>
          If you have any questions about this Privacy Policy, please contact us at svenkatesh0804@gmail.com
        </p>

        <div style={styles.footer}>
          <Link to="/" style={styles.link}>← Back to Home</Link>
        </div>
      </div>
    </main>
  )
}

const styles = {
  card: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
  },
  title: {
    margin: "0 0 16px",
    fontSize: "22px"
  },
  subtitle: {
    margin: "24px 0 12px",
    fontSize: "18px",
    color: "#111"
  },
  text: {
    color: "#444",
    lineHeight: "1.7",
    marginBottom: "16px"
  },
  footer: {
    marginTop: "30px",
    paddingTop: "20px",
    borderTop: "1px solid #eee"
  },
  link: {
    color: "#666",
    textDecoration: "none",
    fontSize: "14px"
  }
}

export default PrivacyPage
