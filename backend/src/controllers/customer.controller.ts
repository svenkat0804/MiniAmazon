import type { Request, Response } from "express"
import { pool } from "../db.js"

export async function getCustomers(
  _req: Request,
  res: Response
) {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name,
        email,
        phone,
        address,
        city,
        state,
        pincode,
        created_at
      FROM customers
      ORDER BY id DESC
    `)

    return res.json({
      customers: result.rows
    })

  } catch (error) {
    console.error("Get customers error:", error)

    return res.status(500).json({
      message: "Failed to get customers"
    })
  }
}

export async function getCustomerById(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id)

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        message: "Invalid customer ID"
      })
    }

    const result = await pool.query(
      `
      SELECT
        id,
        name,
        email,
        phone,
        address,
        city,
        state,
        pincode,
        created_at
      FROM customers
      WHERE id = $1
      `,
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Customer not found"
      })
    }

    return res.json({
      customer: result.rows[0]
    })

  } catch (error) {
    console.error("Get customer error:", error)

    return res.status(500).json({
      message: "Failed to get customer"
    })
  }
}

export async function createCustomer(
  req: Request,
  res: Response
) {
  try {
    const {
      name,
      email,
      phone,
      address,
      city,
      state,
      pincode
    } = req.body

    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required"
      })
    }

    const result = await pool.query(
      `
      INSERT INTO customers
      (name, email, phone, address, city, state, pincode)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
      `,
      [
        name,
        email,
        phone || null,
        address || null,
        city || null,
        state || null,
        pincode || null
      ]
    )

    return res.status(201).json({
      message: "Customer created successfully",
      customer: result.rows[0]
    })

  } catch (error: any) {
    console.error("Create customer error:", error)

    if (error.code === "23505") {
      return res.status(409).json({
        message: "Customer with this email already exists"
      })
    }

    return res.status(500).json({
      message: "Failed to create customer"
    })
  }
}

export async function updateCustomer(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id)

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        message: "Invalid customer ID"
      })
    }

    const {
      name,
      email,
      phone,
      address,
      city,
      state,
      pincode
    } = req.body

    const result = await pool.query(
      `
      UPDATE customers
      SET
        name = $1,
        email = $2,
        phone = $3,
        address = $4,
        city = $5,
        state = $6,
        pincode = $7
      WHERE id = $8
      RETURNING *
      `,
      [
        name,
        email,
        phone || null,
        address || null,
        city || null,
        state || null,
        pincode || null,
        id
      ]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Customer not found"
      })
    }

    return res.json({
      message: "Customer updated successfully",
      customer: result.rows[0]
    })

  } catch (error: any) {
    console.error("Update customer error:", error)

    if (error.code === "23505") {
      return res.status(409).json({
        message: "Customer with this email already exists"
      })
    }

    return res.status(500).json({
      message: "Failed to update customer"
    })
  }
}

export async function getCustomerOrders(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id)

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        message: "Invalid customer ID"
      })
    }

    const result = await pool.query(
      `
      SELECT
        id,
        customer_name,
        customer_email,
        items,
        subtotal,
        shipping_cost,
        total,
        payment_method,
        payment_status,
        order_status,
        created_at
      FROM orders
      WHERE customer_id = $1
      ORDER BY created_at DESC
      `,
      [id]
    )

    return res.json({
      orders: result.rows
    })

  } catch (error) {
    console.error("Get customer orders error:", error)

    return res.status(500).json({
      message: "Failed to get customer orders"
    })
  }
}
