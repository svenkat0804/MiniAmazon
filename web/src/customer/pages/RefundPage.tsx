import { Link } from "react-router-dom"

function RefundPage() {
  return (
    <main className="page-content">
      <h1>Refund Policy</h1>

      <div style={styles.card}>
        <h2 style={styles.title}>Our Refund Promise</h2>
        <p style={styles.text}>
          At DentalKart, we want you to be completely satisfied with your purchase. If you are not satisfied,
          we offer a hassle-free refund process.
        </p>

        <h3 style={styles.subtitle}>Refund Eligibility</h3>
        <p style={styles.text}>
          Products can be returned within 7 days of delivery if they are defective, damaged, or not as described.
          The product must be in its original packaging and unused condition.
        </p>

        <h3 style={styles.subtitle}>Refund Process</h3>
        <p style={styles.text}>
          Once we receive and inspect your return, we will process your refund within 2-3 business days.
          The refund will be credited to your original payment method.
        </p>

        <h3 style={styles.subtitle}>Non-Returnable Items</h3>
        <p style={styles.text}>
          Due to hygiene and safety reasons, certain products such as surgical instruments, implants, and
          consumables that have been opened or used cannot be returned.
        </p>

        <h3 style={styles.subtitle}>How to Request a Refund</h3>
        <p style={styles.text}>
          To request a refund, please contact our support team at svenkatesh0804@gmail.com or call us at
          +91-9710700734. You can also raise a complaint through our Support page.
        </p>

        <div style={styles.infoBox}>
          <strong>Refund Timeline:</strong> 2-3 business days after we receive and inspect the returned item.
        </div>

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
  infoBox: {
    padding: "16px",
    backgroundColor: "#e8f5e9",
    borderRadius: "8px",
    color: "#2e7d32",
    marginTop: "20px"
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

export default RefundPage
