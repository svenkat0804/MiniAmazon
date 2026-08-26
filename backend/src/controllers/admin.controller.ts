import type { Request, Response } from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { pool } from "../db.js"

export async function loginAdmin(
  req: Request,
  res: Response
) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      })
    }

    const result = await pool.query(
      `
      SELECT
        id,
        name,
        email,
        password_hash,
        role,
        is_active
      FROM admins
      WHERE email = $1
      `,
      [email]
    )

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password"
      })
    }

    const admin = result.rows[0]

    if (!admin.is_active) {
      return res.status(403).json({
        message: "Admin account is inactive"
      })
    }

    const passwordMatch = await bcrypt.compare(
      password,
      admin.password_hash
    )

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      })
    }

    const secret = process.env.JWT_SECRET

    if (!secret) {
      throw new Error("JWT_SECRET is not configured")
    }

    const token = jwt.sign(
      {
        adminId: admin.id,
        role: admin.role
      },
      secret,
      {
        expiresIn: "1d"
      }
    )

    return res.json({
      message: "Login successful",
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    })

  } catch (error) {

    console.error("Admin login error:", error)

    return res.status(500).json({
      message: "Internal server error"
    })
  }
}

  
import type { AuthenticatedRequest } from "../middleware/adminAuth.js"

export function getAdminProfile(
  req: AuthenticatedRequest,
  res: Response
) {
  return res.json({
    message: "Admin authentication successful",
    admin: req.admin
  })
} 
