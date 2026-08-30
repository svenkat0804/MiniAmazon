import { Link } from "react-router-dom"

function TermsPage() {
  return (
    <main className="page-content">
      <h1>Terms & Conditions</h1>

      <div style={styles.card}>
        <h2 style={styles.title}>Welcome to DentalKart</h2>
        <p style={styles.text}>
          These terms and conditions outline the rules and regulations for the use of DentalKart's Website.
        </p>

        <h3 style={styles.subtitle}>1. Acceptance of Terms</h3>
        <p style={styles.text}>
          By accessing this website, you agree to be bound by these terms and conditions. If you do not agree,
          please do not use this website.
        </p>

        <h3 style={styles.subtitle}>2. Use of the Website</h3>
        <p style={styles.text}>
          You agree to use this website only for lawful purposes and in a way that does not infringe the rights
          of others or restrict their use and enjoyment of the website.
        </p>

        <h3 style={styles.subtitle}>3. Product Information</h3>
        <p style={styles.text}>
          We strive to display accurate product information, including prices, specifications, and availability.
          However, we do not warrant that product descriptions or other content is accurate, complete, or current.
        </p>

        <h3 style={styles.subtitle}>4. Orders and Payments</h3>
        <p style={styles.text}>
          All orders are subject to acceptance and availability. We reserve the right to cancel any order for
          any reason. Payments must be completed before order processing.
        </p>

        <h3 style={styles.subtitle}>5. Limitation of Liability</h3>
        <p style={styles.text}>
          DentalKart shall not be liable for any indirect, incidental, special, consequential, or punitive damages
          resulting from your use of or inability to use the website.
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

export default TermsPage
