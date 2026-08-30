import type { Request, Response } from "express"
import { pool } from "../db.js"

export async function getNotifications(
  req: Request,
  res: Response
) {
  try {
    const { role, reference_id, page = "1", limit = "10" } = req.query as Record<string, string>

    if (!role || !reference_id) {
      return res.status(400).json({
        message: "Role and reference_id are required"
      })
    }

    const offset = (Number(page) - 1) * Number(limit)

    const result = await pool.query(
      `
      SELECT
        id,
        role,
        reference_id,
        type,
        title,
        message,
        data,
        is_read,
        created_at,
        updated_at
      FROM notifications
      WHERE role = $1 AND reference_id = $2
      ORDER BY created_at DESC
      LIMIT $3 OFFSET $4
      `,
      [role, reference_id, Number(limit), offset]
    )

    const countResult = await pool.query(
      `
      SELECT COUNT(*) FROM notifications
      WHERE role = $1 AND reference_id = $2
      `,
      [role, reference_id]
    )

    const total = Number(countResult.rows[0].count)
    const totalPages = Math.ceil(total / Number(limit))

    return res.json({
      notifications: result.rows,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages
      }
    })

  } catch (error) {
    console.error("Get notifications error:", error)

    return res.status(500).json({
      message: "Failed to get notifications"
    })
  }
}

export async function getUnreadCount(
  req: Request,
  res: Response
) {
  try {
    const { role, reference_id } = req.query as Record<string, string>

    if (!role || !reference_id) {
      return res.status(400).json({
        message: "Role and reference_id are required"
      })
    }

    const result = await pool.query(
      `
      SELECT COUNT(*) FROM notifications
      WHERE role = $1 AND reference_id = $2 AND is_read = false
      `,
      [role, reference_id]
    )

    return res.json({
      count: Number(result.rows[0].count)
    })

  } catch (error) {
    console.error("Get unread count error:", error)

    return res.status(500).json({
      message: "Failed to get unread count"
    })
  }
}

export async function markNotificationRead(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id)

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        message: "Invalid notification ID"
      })
    }

    const result = await pool.query(
      `
      UPDATE notifications
      SET is_read = true, updated_at = NOW()
      WHERE id = $1
      RETURNING *
      `,
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Notification not found"
      })
    }

    return res.json({
      message: "Notification marked as read",
      notification: result.rows[0]
    })

  } catch (error) {
    console.error("Mark notification read error:", error)

    return res.status(500).json({
      message: "Failed to mark notification as read"
    })
  }
}

export async function markAllNotificationsRead(
  req: Request,
  res: Response
) {
  try {
    const { role, reference_id } = req.body as Record<string, string>

    if (!role || !reference_id) {
      return res.status(400).json({
        message: "Role and reference_id are required"
      })
    }

    await pool.query(
      `
      UPDATE notifications
      SET is_read = true, updated_at = NOW()
      WHERE role = $1 AND reference_id = $2 AND is_read = false
      `,
      [role, reference_id]
    )

    return res.json({
      message: "All notifications marked as read"
    })

  } catch (error) {
    console.error("Mark all notifications read error:", error)

    return res.status(500).json({
      message: "Failed to mark all notifications as read"
    })
  }
}

export async function createNotification(
  req: Request,
  res: Response
) {
  try {
    const { role, reference_id, type, title, message, data } = req.body as Record<string, any>

    if (!role || !reference_id || !type || !title || !message) {
      return res.status(400).json({
        message: "Role, reference_id, type, title, and message are required"
      })
    }

    const result = await pool.query(
      `
      INSERT INTO notifications
      (role, reference_id, type, title, message, data)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [
        role,
        reference_id,
        type,
        title,
        message,
        data || null
      ]
    )

    return res.status(201).json({
      message: "Notification created successfully",
      notification: result.rows[0]
    })

  } catch (error) {
    console.error("Create notification error:", error)

    return res.status(500).json({
      message: "Failed to create notification"
    })
  }
}
