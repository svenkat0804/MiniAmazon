import type { Request, Response } from "express"
import { pool } from "../db.js"

// GET all categories
export async function getCategories(
  _req: Request,
  res: Response
) {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name
      FROM categories
      ORDER BY id DESC
    `)

    return res.json({
      categories: result.rows
    })

  } catch (error) {
    console.error("Get categories error:", error)

    return res.status(500).json({
      message: "Failed to get categories"
    })
  }
}


// GET single category
export async function getCategoryById(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id)

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        message: "Invalid category ID"
      })
    }

    const result = await pool.query(
      `
      SELECT
        id,
        name
      FROM categories
      WHERE id = $1
      `,
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Category not found"
      })
    }

    return res.json({
      category: result.rows[0]
    })

  } catch (error) {
    console.error("Get category error:", error)

    return res.status(500).json({
      message: "Failed to get category"
    })
  }
}


// CREATE category
export async function createCategory(
  req: Request,
  res: Response
) {
  try {
    const { name } = req.body

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Category name is required"
      })
    }

    const result = await pool.query(
      `
      INSERT INTO categories
      (name)
      VALUES ($1)
      RETURNING *
      `,
      [name.trim()]
    )

    return res.status(201).json({
      message: "Category created successfully",
      category: result.rows[0]
    })

  } catch (error: any) {
    console.error("Create category error:", error)

    if (error.code === "23505") {
      return res.status(409).json({
        message: "Category already exists"
      })
    }

    return res.status(500).json({
      message: "Failed to create category"
    })
  }
}


// UPDATE category
export async function updateCategory(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id)

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        message: "Invalid category ID"
      })
    }

    const { name } = req.body

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Category name is required"
      })
    }

    const result = await pool.query(
      `
      UPDATE categories
      SET
        name = $1
      WHERE id = $2
      RETURNING *
      `,
      [
        name.trim(),
        id
      ]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Category not found"
      })
    }

    return res.json({
      message: "Category updated successfully",
      category: result.rows[0]
    })

  } catch (error: any) {
    console.error("Update category error:", error)

    if (error.code === "23505") {
      return res.status(409).json({
        message: "Category already exists"
      })
    }

    return res.status(500).json({
      message: "Failed to update category"
    })
  }
}


// DELETE category
export async function deleteCategory(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id)

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        message: "Invalid category ID"
      })
    }

    const result = await pool.query(
      `
      DELETE FROM categories
      WHERE id = $1
      RETURNING id
      `,
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Category not found"
      })
    }

    return res.json({
      message: "Category deleted successfully"
    })

  } catch (error) {
    console.error("Delete category error:", error)

    return res.status(500).json({
      message: "Failed to delete category"
    })
  }
}