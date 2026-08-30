function ContactPage() {
  return (
    <main className="page-content">
      <h1>Contact Us</h1>

      <div style={styles.card}>
        <h2 style={styles.title}>Get in Touch</h2>
        <p style={styles.text}>
          Have a question or need assistance? Our support team is here to help you.
        </p>

        <div style={styles.infoGrid}>
          <div style={styles.infoItem}>
            <strong>📞 Phone</strong>
            <p>+91-9710700734</p>
          </div>
          <div style={styles.infoItem}>
            <strong>📧 Email</strong>
            <p>svenkatesh0804@gmail.com</p>
          </div>
          <div style={styles.infoItem}>
            <strong>📍 Address</strong>
            <p>5/395, Dr.Ambethkart Street, Canalapuram Road, Perungudi, Chennai - 600041</p>
          </div>
          <div style={styles.infoItem}>
            <strong>🕐 Working Hours</strong>
            <p>Mon-Sat: 9:00 AM - 7:00 PM<br />Sun: 10:00 AM - 7:00 PM</p>
          </div>
        </div>

        <div style={styles.socialSection}>
          <h3 style={styles.subtitle}>Follow Us</h3>
          <div style={styles.socialLinks}>
            <a href="https://www.instagram.com/svenkatesh0804/" target="_blank" rel="noopener noreferrer" style={styles.socialLink}>
              Instagram
            </a>
            <a href="https://www.facebook.com/Svenkat.0804" target="_blank" rel="noopener noreferrer" style={styles.socialLink}>
              Facebook
            </a>
            <a href="https://www.linkedin.com/in/svenkatesh0804" target="_blank" rel="noopener noreferrer" style={styles.socialLink}>
              LinkedIn
            </a>
            <a href="https://wa.me/919710700734" target="_blank" rel="noopener noreferrer" style={styles.socialLink}>
              WhatsApp
            </a>
          </div>
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
  text: {
    color: "#444",
    lineHeight: "1.7",
    marginBottom: "24px"
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "24px",
    marginBottom: "30px"
  },
  infoItem: {
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px"
  },
  socialSection: {
    borderTop: "1px solid #eee",
    paddingTop: "24px"
  },
  subtitle: {
    margin: "0 0 16px",
    fontSize: "18px"
  },
  socialLinks: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap" as const
  },
  socialLink: {
    padding: "10px 20px",
    backgroundColor: "#222",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "6px",
    fontSize: "14px"
  }
}

export default ContactPage
