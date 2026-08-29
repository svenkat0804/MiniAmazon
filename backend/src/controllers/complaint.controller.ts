import type { Request, Response } from "express"
import { pool } from "../db.js"

export async function getComplaints(
  req: Request,
  res: Response
) {
  try {
    const { status } = req.query

    let query = `SELECT * FROM complaints`
    const params: (string | number)[] = []

    if (status) {
      query += ` WHERE status = $1`
      params.push(status as string)
    }

    query += ` ORDER BY created_at DESC`

    const result = await pool.query(query, params)

    return res.json({
      complaints: result.rows
    })

  } catch (error) {
    console.error("Get complaints error:", error)

    return res.status(500).json({
      message: "Failed to get complaints"
    })
  }
}

export async function getComplaintById(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id)

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        message: "Invalid complaint ID"
      })
    }

    const result = await pool.query(
      `
      SELECT * FROM complaints WHERE id = $1
      `,
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Complaint not found"
      })
    }

    return res.json({
      complaint: result.rows[0]
    })

  } catch (error) {
    console.error("Get complaint error:", error)

    return res.status(500).json({
      message: "Failed to get complaint"
    })
  }
}

export async function updateComplaintStatus(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id)

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        message: "Invalid complaint ID"
      })
    }

    const { status } = req.body

    const validStatuses = [
      "open",
      "in_progress",
      "resolved",
      "closed"
    ]

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status"
      })
    }

    const result = await pool.query(
      `
      UPDATE complaints
      SET status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
      `,
      [status, id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Complaint not found"
      })
    }

    return res.json({
      message: "Complaint status updated",
      complaint: result.rows[0]
    })

  } catch (error) {
    console.error("Update complaint status error:", error)

    return res.status(500).json({
      message: "Failed to update complaint status"
    })
  }
}

export async function createComplaint(
  req: Request,
  res: Response
) {
  try {
    const {
      customer_name,
      customer_email,
      subject,
      message
    } = req.body

    if (!customer_name || !customer_email || !subject || !message) {
      return res.status(400).json({
        message: "All fields are required"
      })
    }

    const result = await pool.query(
      `
      INSERT INTO complaints
      (customer_name, customer_email, subject, message)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [customer_name, customer_email, subject, message]
    )

    return res.status(201).json({
      message: "Complaint created successfully",
      complaint: result.rows[0]
    })

  } catch (error) {
    console.error("Create complaint error:", error)

    return res.status(500).json({
      message: "Failed to create complaint"
    })
  }
}
