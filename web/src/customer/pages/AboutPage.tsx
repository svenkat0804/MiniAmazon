function AboutPage() {
  return (
    <main className="page-content">
      <h1>About DentalKart</h1>

      <div style={styles.card}>
        <h2 style={styles.title}>India's Largest Online Dental Store</h2>
        <p style={styles.text}>
          DentalKart is India's most trusted online platform for dental products and supplies.
          Established in 2016, we have been serving dental clinics, hospitals, and individual practitioners
          across the country with quality products at competitive prices.
        </p>
        <p style={styles.text}>
          Our mission is to make quality dental equipment and consumables accessible to every dental
          professional in India. We partner with leading global manufacturers to bring you authentic
          products with genuine warranties.
        </p>

        <h3 style={styles.subtitle}>Why Choose DentalKart?</h3>
        <ul style={styles.list}>
          <li>Genuine products with manufacturer warranty</li>
          <li>Fast delivery across India</li>
          <li>Easy returns and refunds</li>
          <li>Dedicated customer support</li>
          <li>Exclusive deals for dental professionals</li>
        </ul>
      </div>

      <div style={styles.card}>
        <h2 style={styles.title}>Our Vision</h2>
        <p style={styles.text}>
          To empower every dental professional with easy access to world-class dental products,
          enabling them to provide the best care to their patients.
        </p>
      </div>
    </main>
  )
}

const styles = {
  card: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    marginBottom: "20px"
  },
  title: {
    margin: "0 0 16px",
    fontSize: "22px"
  },
  subtitle: {
    margin: "24px 0 12px",
    fontSize: "18px"
  },
  text: {
    color: "#444",
    lineHeight: "1.7",
    marginBottom: "16px"
  },
  list: {
    color: "#444",
    lineHeight: "2",
    paddingLeft: "20px"
  }
}

export default AboutPage
