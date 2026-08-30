import type { Request, Response } from "express"
import { pool } from "../db.js"

// GET all products
export async function getProducts(
  _req: Request,
  res: Response
) {
  try {
    const result = await pool.query(`
      SELECT
        p.id,
        p.name,
        p.description,
        p.price,
        p.stock,
        p.is_active,
        p.image_url,
        p.created_at,
        c.id AS category_id,
        c.name AS category_name
      FROM products p
      INNER JOIN categories c
        ON p.category_id = c.id
      ORDER BY p.id DESC
    `)

    return res.json({
      products: result.rows
    })

  } catch (error) {
    console.error("Get products error:", error)

    return res.status(500).json({
      message: "Failed to get products"
    })
  }
}


// GET single product
export async function getProductById(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id)

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        message: "Invalid product ID"
      })
    }

    const result = await pool.query(
      `
      SELECT
        p.id,
        p.name,
        p.description,
        p.price,
        p.stock,
        p.is_active,
        p.image_url,
        p.created_at,
        c.id AS category_id,
        c.name AS category_name
      FROM products p
      INNER JOIN categories c
        ON p.category_id = c.id
      WHERE p.id = $1
      `,
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Product not found"
      })
    }

    return res.json({
      product: result.rows[0]
    })

  } catch (error) {
    console.error("Get product error:", error)

    return res.status(500).json({
      message: "Failed to get product"
    })
  }
}


// CREATE product
export async function createProduct(
  req: Request,
  res: Response
) {
  try {
    const {
      category_id,
      name,
      description,
      price,
      stock,
      image_url
    } = req.body

    if (
      !category_id ||
      !name ||
      price === undefined
    ) {
      return res.status(400).json({
        message: "Category, name and price are required"
      })
    }

    const categoryResult = await pool.query(
      "SELECT id FROM categories WHERE id = $1",
      [category_id]
    )

    if (categoryResult.rows.length === 0) {
      return res.status(400).json({
        message: "Category not found"
      })
    }

    const slug =
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")

    const result = await pool.query(
      `
      INSERT INTO products
      (
        category_id,
        name,
        slug,
        description,
        price,
        stock,
        image_url
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
      `,
      [
        category_id,
        name,
        slug,
        description || null,
        price,
        stock ?? 0,
        image_url || null
      ]
    )

    return res.status(201).json({
      message: "Product created successfully",
      product: result.rows[0]
    })

  } catch (error) {
    console.error("Create product error:", error)

    return res.status(500).json({
      message: "Failed to create product"
    })
  }
}


// UPDATE product
export async function updateProduct(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id)

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        message: "Invalid product ID"
      })
    }

    const {
      category_id,
      name,
      description,
      price,
      stock,
      is_active,
      image_url
    } = req.body

    const result = await pool.query(
      `
      UPDATE products
      SET
        category_id = $1,
        name = $2,
        description = $3,
        price = $4,
        stock = $5,
        is_active = $6,
        image_url = $7
      WHERE id = $8
      RETURNING *
      `,
      [
        category_id,
        name,
        description || null,
        price,
        stock ?? 0,
        is_active ?? true,
        image_url || null,
        id
      ]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Product not found"
      })
    }

    return res.json({
      message: "Product updated successfully",
      product: result.rows[0]
    })

  } catch (error) {
    console.error("Update product error:", error)

    return res.status(500).json({
      message: "Failed to update product"
    })
  }
}


// DELETE product
export async function deleteProduct(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id)

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        message: "Invalid product ID"
      })
    }

    const result = await pool.query(
      `
      DELETE FROM products
      WHERE id = $1
      RETURNING id
      `,
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Product not found"
      })
    }

    return res.json({
      message: "Product deleted successfully"
    })

  } catch (error) {
    console.error("Delete product error:", error)

    return res.status(500).json({
      message: "Failed to delete product"
    })
  }
} 
