
import bcrypt from "bcrypt"
import { Pool } from "pg"
import "dotenv/config" 

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || undefined
})

async function createAdmin() {
  const name = "Admin"
  const email = "admin@miniamazon.com"
  const password = "Admin@123"

  try {
    const existingAdmin = await pool.query(
      "SELECT id FROM admins WHERE email = $1",
      [email]
    )

    if (existingAdmin.rows.length > 0) {
      console.log("Admin already exists")
      return
    }

    const passwordHash = await bcrypt.hash(password, 10)

    await pool.query(
      `
      INSERT INTO admins
      (name, email, password_hash, role, is_active)
      VALUES ($1, $2, $3, $4, $5)
      `,
      [
        name,
        email,
        passwordHash,
        "admin",
        true
      ]
    )

    console.log("Admin created successfully")
    console.log("Email:", email)
    console.log("Password:", password)
  } catch (error) {
    console.error("Failed to create admin:", error)
  } finally {
    await pool.end()
  }
}

createAdmin() 
