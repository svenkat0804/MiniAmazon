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
        is_active,
        image_url
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
        role: admin.role,
        image_url: admin.image_url || null
      }
    })

  } catch (error) {

    console.error("Admin login error:", error)

    return res.status(500).json({
      message: "Internal server error"
    })
  }
}


export async function updateAdminProfile(
  req: Request,
  res: Response
) {
  try {
    const adminId = (req as any).admin?.adminId

    if (!adminId) {
      return res.status(401).json({
        message: "Unauthorized"
      })
    }

    const { name, image_url } = req.body

    const result = await pool.query(
      `
      UPDATE admins
      SET
        name = COALESCE($1, name),
        image_url = COALESCE($2, image_url),
        updated_at = NOW()
      WHERE id = $3
      RETURNING id, name, email, role, image_url
      `,
      [
        name,
        image_url,
        adminId
      ]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Admin not found"
      })
    }

    return res.json({
      message: "Profile updated successfully",
      admin: result.rows[0]
    })

  } catch (error) {
    console.error("Update admin profile error:", error)

    return res.status(500).json({
      message: "Failed to update profile"
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
