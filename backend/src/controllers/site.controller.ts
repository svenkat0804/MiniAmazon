import type { Request, Response } from "express"
import { pool } from "../db.js"

export async function getSiteSettings(
  _req: Request,
  res: Response
) {
  try {
    const result = await pool.query(
      "SELECT key, value FROM site_settings"
    )

    const settings: Record<string, string> = {}
    for (const row of result.rows) {
      settings[row.key] = row.value
    }

    return res.json({
      settings
    })

  } catch (error) {
    console.error("Get site settings error:", error)

    return res.status(500).json({
      message: "Failed to get site settings"
    })
  }
}

export async function updateSiteSetting(
  req: Request,
  res: Response
) {
  try {
    const { key, value } = req.body

    if (!key) {
      return res.status(400).json({
        message: "Key is required"
      })
    }

    const result = await pool.query(
      `
      INSERT INTO site_settings (key, value, updated_at)
      VALUES ($1, $2, NOW())
      ON CONFLICT (key)
      DO UPDATE SET value = EXCLUDED.value, updated_at = EXCLUDED.updated_at
      RETURNING *
      `,
      [key, value || null]
    )

    return res.json({
      message: "Setting updated successfully",
      setting: result.rows[0]
    })

  } catch (error) {
    console.error("Update site setting error:", error)

    return res.status(500).json({
      message: "Failed to update setting"
    })
  }
}
