import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

export interface AuthenticatedRequest extends Request {
  admin?: {
    adminId: number
    role: string
  }
}

export function adminAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).json({
        message: "Authorization token is required"
      })
    }

    const parts = authHeader.split(" ")

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({
        message: "Invalid authorization format"
      })
    }

    const token = parts[1]

    const secret = process.env.JWT_SECRET

    if (!secret) {
      return res.status(500).json({
        message: "JWT_SECRET is not configured"
      })
    }

    const decoded = jwt.verify(token, secret) as {
      adminId: number
      role: string
    }

    if (decoded.role !== "admin") {
      return res.status(403).json({
        message: "Admin access required"
      })
    }

    req.admin = {
      adminId: decoded.adminId,
      role: decoded.role
    }

    next()

  } catch (error) {
    console.error("JWT authentication error:", error)

    return res.status(401).json({
      message: "Invalid or expired token"
    })
  }
}