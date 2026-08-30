import "dotenv/config"
import { pool } from "../db.js"

async function setupDatabase() {
  try {
    console.log("Setting up database...")

    await pool.query(`
      DROP TABLE IF EXISTS order_items CASCADE
    `)

    await pool.query(`
      DROP TABLE IF EXISTS order_status_history CASCADE
    `)

    await pool.query(`
      DROP TABLE IF EXISTS complaints CASCADE
    `)

    await pool.query(`
      DROP TABLE IF EXISTS orders CASCADE
    `)

    await pool.query(`
      DROP TABLE IF EXISTS shipments CASCADE
    `)

    await pool.query(`
      DROP TABLE IF EXISTS payments CASCADE
    `)

    await pool.query(`
      DROP TABLE IF EXISTS coupons CASCADE
    `)

    await pool.query(`
      DROP TABLE IF EXISTS wishlists CASCADE
    `)

    await pool.query(`
      DROP TABLE IF EXISTS reviews CASCADE
    `)

    await pool.query(`
      DROP TABLE IF EXISTS product_images CASCADE
    `)

    await pool.query(`
      DROP TABLE IF EXISTS product_variants CASCADE
    `)

    await pool.query(`
      DROP TABLE IF EXISTS products CASCADE
    `)

    await pool.query(`
      DROP TABLE IF EXISTS categories CASCADE
    `)

    await pool.query(`
      DROP TABLE IF EXISTS customers CASCADE
    `)

    await pool.query(`
      DROP TABLE IF EXISTS admins CASCADE
    `)

    await pool.query(`
      CREATE TABLE admins (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        is_active BOOLEAN DEFAULT true,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)

    await pool.query(`
      CREATE TABLE categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        image_url TEXT,
        parent_id INTEGER REFERENCES categories(id),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)

    await pool.query(`
      CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        category_id INTEGER REFERENCES categories(id),
        price DECIMAL(10,2) NOT NULL,
        stock INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)

    await pool.query(`
      CREATE TABLE product_images (
        id SERIAL PRIMARY KEY,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        url TEXT NOT NULL,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `)

    await pool.query(`
      CREATE TABLE product_variants (
        id SERIAL PRIMARY KEY,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        sku VARCHAR(100) UNIQUE NOT NULL,
        attributes JSONB,
        price DECIMAL(10,2) NOT NULL,
        stock_quantity INTEGER DEFAULT 0,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)

    await pool.query(`
      CREATE TABLE customers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20),
        address TEXT,
        city VARCHAR(100),
        state VARCHAR(100),
        pincode VARCHAR(10),
        image_url TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `)

    await pool.query(`
      CREATE TABLE reviews (
        id SERIAL PRIMARY KEY,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES customers(id),
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `)

    await pool.query(`
      CREATE TABLE wishlists (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES customers(id),
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, product_id)
      )
    `)

    await pool.query(`
      CREATE TABLE coupons (
        id SERIAL PRIMARY KEY,
        code VARCHAR(100) UNIQUE NOT NULL,
        type VARCHAR(50) NOT NULL,
        value DECIMAL(10,2) NOT NULL,
        min_order_value DECIMAL(10,2) DEFAULT 0,
        usage_limit INTEGER,
        used_count INTEGER DEFAULT 0,
        expires_at TIMESTAMP,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `)

    await pool.query(`
      CREATE TABLE orders (
        id SERIAL PRIMARY KEY,
        customer_id INTEGER REFERENCES customers(id),
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(20),
        shipping_address TEXT,
        shipping_city VARCHAR(100),
        shipping_state VARCHAR(100),
        shipping_pincode VARCHAR(10),
        items JSONB NOT NULL,
        subtotal DECIMAL(10,2) NOT NULL,
        shipping_cost DECIMAL(10,2) DEFAULT 0,
        total DECIMAL(10,2) NOT NULL,
        payment_method VARCHAR(50) DEFAULT 'COD',
        payment_status VARCHAR(50) DEFAULT 'SUCCESS',
        order_status VARCHAR(50) DEFAULT 'PLACED',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)

    await pool.query(`
      CREATE TABLE order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        product_variant_id INTEGER,
        product_name_snapshot VARCHAR(255) NOT NULL,
        price_snapshot DECIMAL(10,2) NOT NULL,
        quantity INTEGER NOT NULL
      )
    `)

    await pool.query(`
      CREATE TABLE order_status_history (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id),
        status VARCHAR(50) NOT NULL,
        note TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `)

    await pool.query(`
      CREATE TABLE payments (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id),
        provider VARCHAR(50) DEFAULT 'razorpay',
        razorpay_order_id VARCHAR(255),
        razorpay_payment_id VARCHAR(255),
        razorpay_signature VARCHAR(255),
        method VARCHAR(50),
        amount DECIMAL(10,2) NOT NULL,
        currency VARCHAR(10) DEFAULT 'INR',
        status VARCHAR(50) DEFAULT 'created',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)

    await pool.query(`
      CREATE TABLE shipments (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id),
        courier_partner VARCHAR(100),
        aggregator VARCHAR(100) DEFAULT 'shiprocket',
        awb_number VARCHAR(255),
        shipment_status VARCHAR(50) DEFAULT 'pending',
        pickup_address TEXT,
        delivery_address TEXT,
        estimated_delivery_date TIMESTAMP,
        shipping_cost DECIMAL(10,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)

    await pool.query(`
      CREATE TABLE complaints (
        id SERIAL PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'open',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)

    await pool.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        id SERIAL PRIMARY KEY,
        key VARCHAR(100) UNIQUE NOT NULL,
        value TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)

    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        role VARCHAR(50) NOT NULL DEFAULT 'customer',
        reference_id INTEGER NOT NULL,
        type VARCHAR(100) NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        data JSONB,
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)

    await pool.query(`
      CREATE INDEX idx_products_slug ON products(slug)
    `)

    await pool.query(`
      CREATE INDEX idx_products_category_id ON products(category_id)
    `)

    // user_id index removed - column no longer exists

    await pool.query(`
      CREATE INDEX idx_orders_order_status ON orders(order_status)
    `)

    await pool.query(`
      CREATE INDEX idx_product_variants_sku ON product_variants(sku)
    `)

    await pool.query(`
      CREATE INDEX idx_order_status_history_order_id ON order_status_history(order_id)
    `)

    await pool.query(`
      CREATE INDEX idx_complaints_status ON complaints(status)
    `)

    console.log("All tables created successfully")

    const adminCheck = await pool.query(
      "SELECT id FROM admins WHERE email = $1",
      ["admin@dentalkart.com"]
    )

    if (adminCheck.rows.length === 0) {
      const bcrypt = await import("bcrypt")
      const passwordHash = await bcrypt.hash("admin123", 10)

      await pool.query(
        `
        INSERT INTO admins
        (name, email, password_hash, role, is_active)
        VALUES ($1, $2, $3, $4, $5)
        `,
        ["Admin", "admin@dentalkart.com", passwordHash, "admin", true]
      )

      console.log("Admin user created: admin@dentalkart.com / admin123")
    } else {
      console.log("Admin user already exists")
    }

    const categoryCheck = await pool.query(
      "SELECT id FROM categories WHERE name = $1",
      ["Implant Prosthetics"]
    )

    if (categoryCheck.rows.length === 0) {
      const categoryData = [
        ["Implant Prosthetics", "https://images.unsplash.com/photo-1770321119162-05c18fbcfdb9?fm=jpg&q=80&w=800&auto=format&fit=crop"],
        ["Airotors", "https://images.pexels.com/photos/6502661/pexels-photo-6502661.jpeg?auto=compress&w=800"],
        ["Composite", "https://images.pexels.com/photos/3845728/pexels-photo-3845728.jpeg?auto=compress&w=800"],
        ["Intra Oral Camera", "https://images.pexels.com/photos/3845729/pexels-photo-3845729.jpeg?auto=compress&w=800"],
        ["Endomotors", "https://images.pexels.com/photos/6502661/pexels-photo-6502661.jpeg?auto=compress&w=800"],
        ["Autoclave", "https://images.pexels.com/photos/3845728/pexels-photo-3845728.jpeg?auto=compress&w=800"],
        ["Rotary Files", "https://images.pexels.com/photos/6502336/pexels-photo-6502336.jpeg?auto=compress&w=800"],
        ["Cements", "https://images.pexels.com/photos/3845729/pexels-photo-3845729.jpeg?auto=compress&w=800"],
        ["Impression Materials", "https://images.pexels.com/photos/7788360/pexels-photo-7788360.jpeg?auto=compress&w=800"],
        ["Brackets", "https://images.pexels.com/photos/6529122/pexels-photo-6529122.jpeg?auto=compress&w=800"],
        ["Sutures & Needles", "https://images.pexels.com/photos/6627456/pexels-photo-6627456.jpeg?auto=compress&w=800"],
        ["Spare Parts", "https://images.pexels.com/photos/6502336/pexels-photo-6502336.jpeg?auto=compress&w=800"]
      ]

      for (const [name, imageUrl] of categoryData) {
        await pool.query(
          `
          INSERT INTO categories (name, image_url)
          VALUES ($1, $2)
          `,
          [name, imageUrl]
        )
      }

      console.log("Sample categories created")
    }

    const productCheck = await pool.query(
      "SELECT id FROM products WHERE slug = $1",
      ["premium-dental-chair"]
    )

    if (productCheck.rows.length === 0) {
      const categories = await pool.query("SELECT id, name FROM categories")
      const categoryMap = new Map(categories.rows.map((c: any) => [c.name, c.id]))

      const productData = [
        { name: "Premium Dental Chair", slug: "premium-dental-chair", description: "High quality dental chair with excellent performance and value.", price: 249999, category: "Implant Prosthetics", stock: 5, is_active: true },
        { name: "High Speed Airotor Handpiece", slug: "high-speed-airotor-handpiece", description: "High quality product with excellent performance and value.", price: 18999, category: "Airotors", stock: 25, is_active: true },
        { name: "Universal Composite Kit", slug: "universal-composite-kit", description: "High quality product with excellent performance and value.", price: 4599, category: "Composite", stock: 50, is_active: true },
        { name: "Wireless Intraoral Scanner", slug: "wireless-intraoral-scanner", description: "High quality product with excellent performance and value.", price: 129999, category: "Intra Oral Camera", stock: 3, is_active: true },
        { name: "Endomotor with Apex Locator", slug: "endomotor-with-apex-locator", description: "High quality product with excellent performance and value.", price: 34999, category: "Endomotors", stock: 15, is_active: true },
        { name: "Digital Autoclave Sterilizer", slug: "digital-autoclave-sterilizer", description: "High quality product with excellent performance and value.", price: 58999, category: "Autoclave", stock: 8, is_active: true },
        { name: "NiTi Rotary File Set", slug: "niti-rotary-file-set", description: "High quality product with excellent performance and value.", price: 3299, category: "Rotary Files", stock: 100, is_active: true },
        { name: "Dental Glass Ionomer Cement", slug: "dental-glass-ionomer-cement", description: "High quality product with excellent performance and value.", price: 1299, category: "Cements", stock: 200, is_active: true },
        { name: "Silicone Impression Material", slug: "silicone-impression-material", description: "High quality product with excellent performance and value.", price: 2499, category: "Impression Materials", stock: 75, is_active: true },
        { name: "Metal Brackets Kit", slug: "metal-brackets-kit", description: "High quality product with excellent performance and value.", price: 1899, category: "Brackets", stock: 60, is_active: true },
        { name: "Sterile Sutures Pack", slug: "sterile-sutures-pack", description: "High quality product with excellent performance and value.", price: 899, category: "Sutures & Needles", stock: 150, is_active: true },
        { name: "Dental Unit Spare Part", slug: "dental-unit-spare-part", description: "High quality product with excellent performance and value.", price: 3499, category: "Spare Parts", stock: 30, is_active: true },
        { name: "LED Curing Light", slug: "led-curing-light", description: "High quality product with excellent performance and value.", price: 8999, category: "Composite", stock: 20, is_active: true },
        { name: "Dental Microscope", slug: "dental-microscope", description: "High quality product with excellent performance and value.", price: 299999, category: "Intra Oral Camera", stock: 2, is_active: true },
        { name: "Implant Driver Kit", slug: "implant-driver-kit", description: "High quality product with excellent performance and value.", price: 15999, category: "Implant Prosthetics", stock: 18, is_active: true },
        { name: "Rotary File Organizer", slug: "rotary-file-organizer", description: "High quality product with excellent performance and value.", price: 2499, category: "Rotary Files", stock: 45, is_active: true },
        { name: "Dental Burs Set", slug: "dental-burs-set", description: "High quality product with excellent performance and value.", price: 3999, category: "Spare Parts", stock: 0, is_active: false },
        { name: "Elastic Ligatures", slug: "elastic-ligatures", description: "High quality product with excellent performance and value.", price: 599, category: "Brackets", stock: 500, is_active: true },
        { name: "Alginate Impression Material", slug: "alginate-impression-material", description: "High quality product with excellent performance and value.", price: 1299, category: "Impression Materials", stock: 120, is_active: true },
        { name: "Zinc Oxide Eugenol", slug: "zinc-oxide-eugenol", description: "High quality product with excellent performance and value.", price: 799, category: "Cements", stock: 0, is_active: false }
      ]

      for (const product of productData) {
        const categoryId = categoryMap.get(product.category)
        if (categoryId) {
          await pool.query(
            `
            INSERT INTO products (name, slug, description, category_id, price, stock, is_active)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            `,
            [product.name, product.slug, product.description, categoryId, product.price, product.stock, product.is_active]
          )
        }
      }

      console.log("Sample products created")
    }

    const customerCheck = await pool.query(
      "SELECT id FROM customers WHERE email = $1",
      ["john@example.com"]
    )

    if (customerCheck.rows.length === 0) {
      const customerData = [
        ["John Doe", "john@example.com", "9876543210", "123 Main St", "Chennai", "Tamil Nadu", "600001"],
        ["Jane Smith", "jane@example.com", "9876543211", "456 Oak Ave", "Mumbai", "Maharashtra", "400001"],
        ["Raj Patel", "raj@example.com", "9876543212", "789 Pine Rd", "Bangalore", "Karnataka", "560001"],
        ["Priya Sharma", "priya@example.com", "9876543213", "321 Lake View", "Delhi", "Delhi", "110001"],
        ["Amit Kumar", "amit@example.com", "9876543214", "654 Park Street", "Kolkata", "West Bengal", "700001"],
        ["Sneha Reddy", "sneha@example.com", "9876543215", "987 MG Road", "Hyderabad", "Telangana", "500001"]
      ]

      for (const [name, email, phone, address, city, state, pincode] of customerData) {
        await pool.query(
          `
          INSERT INTO customers (name, email, phone, address, city, state, pincode)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          `,
          [name, email, phone, address, city, state, pincode]
        )
      }

      console.log("Sample customers created")
    }

    const orderCheck = await pool.query(
      "SELECT id FROM orders LIMIT 1"
    )

    if (orderCheck.rows.length === 0) {
      const customers = await pool.query("SELECT id, name, email FROM customers")
      const customer = customers.rows[0]

      if (customer) {
        const orderStatuses = ["PLACED", "CONFIRMED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"]

        const orderTemplates = [
          {
            items: [{ id: 1, name: "Premium Dental Chair", price: 249999, quantity: 1 }],
            subtotal: 249999,
            shipping: 0,
            total: 249999,
            status: "PLACED",
            paymentMethod: "COD",
            paymentStatus: "PENDING"
          },
          {
            items: [{ id: 2, name: "High Speed Airotor Handpiece", price: 18999, quantity: 2 }],
            subtotal: 37998,
            shipping: 99,
            total: 38097,
            status: "CONFIRMED",
            paymentMethod: "UPI",
            paymentStatus: "SUCCESS"
          },
          {
            items: [
              { id: 3, name: "Universal Composite Kit", price: 4599, quantity: 1 },
              { id: 7, name: "NiTi Rotary File Set", price: 3299, quantity: 2 }
            ],
            subtotal: 11197,
            shipping: 99,
            total: 11296,
            status: "SHIPPED",
            paymentMethod: "CREDIT_CARD",
            paymentStatus: "SUCCESS"
          },
          {
            items: [{ id: 5, name: "Endomotor with Apex Locator", price: 34999, quantity: 1 }],
            subtotal: 34999,
            shipping: 0,
            total: 34999,
            status: "OUT_FOR_DELIVERY",
            paymentMethod: "DEBIT_CARD",
            paymentStatus: "SUCCESS"
          },
          {
            items: [
              { id: 6, name: "Digital Autoclave Sterilizer", price: 58999, quantity: 1 },
              { id: 8, name: "Dental Glass Ionomer Cement", price: 1299, quantity: 5 }
            ],
            subtotal: 65494,
            shipping: 0,
            total: 65494,
            status: "DELIVERED",
            paymentMethod: "UPI",
            paymentStatus: "SUCCESS"
          },
          {
            items: [{ id: 4, name: "Wireless Intraoral Scanner", price: 129999, quantity: 1 }],
            subtotal: 129999,
            shipping: 0,
            total: 129999,
            status: "PLACED",
            paymentMethod: "CREDIT_CARD",
            paymentStatus: "FAILED"
          },
          {
            items: [
              { id: 9, name: "Silicone Impression Material", price: 2499, quantity: 3 },
              { id: 10, name: "Metal Brackets Kit", price: 1899, quantity: 2 }
            ],
            subtotal: 11195,
            shipping: 99,
            total: 11294,
            status: "CONFIRMED",
            paymentMethod: "COD",
            paymentStatus: "PENDING"
          },
          {
            items: [{ id: 11, name: "Sterile Sutures Pack", price: 899, quantity: 10 }],
            subtotal: 8990,
            shipping: 99,
            total: 9089,
            status: "DELIVERED",
            paymentMethod: "UPI",
            paymentStatus: "SUCCESS"
          }
        ]

        for (let i = 0; i < orderTemplates.length; i++) {
          const template = orderTemplates[i]
          const orderNumber = `ORD-${String(1000 + i).padStart(4, "0")}`

          const orderResult = await pool.query(
            `
            INSERT INTO orders
            (customer_id, customer_name, customer_email, customer_phone, shipping_address, shipping_city, shipping_state, shipping_pincode, items, subtotal, shipping_cost, total, payment_method, payment_status, order_status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
            RETURNING id
            `,
            [
              customer.id,
              customer.name,
              customer.email,
              "9876543210",
              "123 Main St",
              "Chennai",
              "Tamil Nadu",
              "600001",
              '[]',
              template.subtotal,
              template.shipping,
              template.total,
              template.paymentMethod,
              template.paymentStatus,
              template.status
            ]
          )

          const orderId = orderResult.rows[0].id

          for (const item of template.items) {
            await pool.query(
              `
              INSERT INTO order_items (order_id, product_variant_id, product_name_snapshot, price_snapshot, quantity)
              VALUES ($1, $2, $3, $4, $5)
              `,
              [orderId, item.id, item.name, item.price, item.quantity]
            )
          }

          const statusHistory = []
          const statusIndex = orderStatuses.indexOf(template.status)
          for (let j = 0; j <= statusIndex; j++) {
            statusHistory.push({
              status: orderStatuses[j],
              note: `Order status updated to ${orderStatuses[j].toLowerCase()}`
            })
          }

          for (const history of statusHistory) {
            await pool.query(
              `
              INSERT INTO order_status_history (order_id, status, note)
              VALUES ($1, $2, $3)
              `,
              [orderId, history.status, history.note]
            )
          }
        }

        console.log("Sample orders created")
      }
    }

    const complaintCheck = await pool.query(
      "SELECT id FROM complaints LIMIT 1"
    )

    if (complaintCheck.rows.length === 0) {
      const complaintData = [
        ["John Doe", "john@example.com", "Delayed Delivery", "My order ORD-1001 has been delayed by 3 days. Please check and update.", "open"],
        ["Jane Smith", "jane@example.com", "Wrong Product Received", "I received a different product than what I ordered. Order ORD-1002 was supposed to contain Composite Kit but got something else.", "in_progress"],
        ["Raj Patel", "raj@example.com", "Refund Request", "I would like to request a refund for order ORD-1003. Payment was deducted but order was not confirmed.", "resolved"],
        ["Priya Sharma", "priya@example.com", "Product Quality Issue", "The dental chair I received has a manufacturing defect. The hydraulic system is not working properly.", "open"],
        ["Amit Kumar", "amit@example.com", "Shipping Address Change", "I need to change my delivery address for order ORD-1005. Please update before dispatch.", "in_progress"],
        ["Sneha Reddy", "sneha@example.com", "Payment Gateway Issue", "Payment failed but amount was deducted from my account. Order ID: ORD-1006. Please refund or confirm order.", "open"]
      ]

      for (const [name, email, subject, message, status] of complaintData) {
        await pool.query(
          `
          INSERT INTO complaints (customer_name, customer_email, subject, message, status)
          VALUES ($1, $2, $3, $4, $5)
          `,
          [name, email, subject, message, status]
        )
      }

      console.log("Sample complaints created")
    }

    console.log("Database setup completed successfully!")

  } catch (error) {
    console.error("Database setup error:", error)
  } finally {
    await pool.end()
  }
}

setupDatabase()
