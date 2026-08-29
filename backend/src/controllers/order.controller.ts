import type { Request, Response } from "express"
import { pool } from "../db.js"

export async function getOrders(
  req: Request,
  res: Response
) {
  try {
    const { status, payment_status } = req.query

    let query = `
      SELECT
        o.id,
        o.customer_id,
        o.customer_name,
        o.customer_email,
        o.customer_phone,
        o.shipping_address,
        o.shipping_city,
        o.shipping_state,
        o.shipping_pincode,
        o.items,
        o.subtotal,
        o.shipping_cost,
        o.total,
        o.payment_method,
        o.payment_status,
        o.order_status,
        o.created_at,
        o.updated_at
      FROM orders o
    `

    const conditions: string[] = []
    const params: (string | number)[] = []
    let paramIndex = 1

    if (status) {
      conditions.push(`o.order_status = $${paramIndex}`)
      params.push(status as string)
      paramIndex++
    }

    if (payment_status) {
      conditions.push(`o.payment_status = $${paramIndex}`)
      params.push(payment_status as string)
      paramIndex++
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`
    }

    query += ` ORDER BY o.created_at DESC`

    const result = await pool.query(query, params)

    return res.json({
      orders: result.rows
    })

  } catch (error) {
    console.error("Get orders error:", error)

    return res.status(500).json({
      message: "Failed to get orders"
    })
  }
}

export async function getOrderById(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id)

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        message: "Invalid order ID"
      })
    }

    const result = await pool.query(
      `
      SELECT * FROM orders WHERE id = $1
      `,
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Order not found"
      })
    }

    const order = result.rows[0]

    const historyResult = await pool.query(
      `
      SELECT * FROM order_status_history
      WHERE order_id = $1
      ORDER BY created_at DESC
      `,
      [id]
    )

    return res.json({
      order,
      history: historyResult.rows
    })

  } catch (error) {
    console.error("Get order error:", error)

    return res.status(500).json({
      message: "Failed to get order"
    })
  }
}

export async function updateOrderStatus(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id)

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        message: "Invalid order ID"
      })
    }

    const { status, note } = req.body

    const result = await pool.query(
      `
      UPDATE orders
      SET order_status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
      `,
      [status, id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Order not found"
      })
    }

    await pool.query(
      `
      INSERT INTO order_status_history
      (order_id, status, note)
      VALUES ($1, $2, $3)
      `,
      [id, status, note || null]
    )

    return res.json({
      message: "Order status updated",
      order: result.rows[0]
    })

  } catch (error) {
    console.error("Update order status error:", error)

    return res.status(500).json({
      message: "Failed to update order status"
    })
  }
}

export async function updatePaymentStatus(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id)

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        message: "Invalid order ID"
      })
    }

    const { payment_status } = req.body

    const result = await pool.query(
      `
      UPDATE orders
      SET payment_status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
      `,
      [payment_status, id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Order not found"
      })
    }

    return res.json({
      message: "Payment status updated",
      order: result.rows[0]
    })

  } catch (error) {
    console.error("Update payment status error:", error)

    return res.status(500).json({
      message: "Failed to update payment status"
    })
  }
}

export async function createOrder(
  req: Request,
  res: Response
) {
  try {
    const {
      customer_id,
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      shipping_city,
      shipping_state,
      shipping_pincode,
      items,
      subtotal,
      shipping_cost,
      total,
      payment_method,
      payment_status,
      order_status
    } = req.body

    if (!customer_name || !customer_email || !items || !total) {
      return res.status(400).json({
        message: "Missing required fields"
      })
    }

    const result = await pool.query(
      `
      INSERT INTO orders
      (
        customer_id,
        customer_name,
        customer_email,
        customer_phone,
        shipping_address,
        shipping_city,
        shipping_state,
        shipping_pincode,
        items,
        subtotal,
        shipping_cost,
        total,
        payment_method,
        payment_status,
        order_status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *
      `,
      [
        customer_id || null,
        customer_name,
        customer_email,
        customer_phone || null,
        shipping_address || null,
        shipping_city || null,
        shipping_state || null,
        shipping_pincode || null,
        JSON.stringify(items),
        subtotal || total,
        shipping_cost || 0,
        total,
        payment_method || "COD",
        payment_status || "SUCCESS",
        order_status || "PLACED"
      ]
    )

    const order = result.rows[0]

    await pool.query(
      `
      INSERT INTO order_status_history
      (order_id, status, note)
      VALUES ($1, $2, $3)
      `,
      [order.id, order.order_status, "Order placed successfully"]
    )

    return res.status(201).json({
      message: "Order created successfully",
      order
    })

  } catch (error) {
    console.error("Create order error:", error)

    return res.status(500).json({
      message: "Failed to create order"
    })
  }
}

export async function getOrderStats(
  req: Request,
  res: Response
) {
  try {
    const totalResult = await pool.query(
      `SELECT COUNT(*) FROM orders`
    )

    const revenueResult = await pool.query(
      `
      SELECT COALESCE(SUM(total), 0) as total_revenue
      FROM orders
      WHERE payment_status = 'SUCCESS'
      `
    )

    const statusResult = await pool.query(
      `
      SELECT order_status, COUNT(*) as count
      FROM orders
      GROUP BY order_status
      `
    )

    const paymentResult = await pool.query(
      `
      SELECT payment_status, COUNT(*) as count
      FROM orders
      GROUP BY payment_status
      `
    )

    return res.json({
      stats: {
        total_orders: parseInt(totalResult.rows[0].count),
        total_revenue: parseFloat(revenueResult.rows[0].total_revenue),
        status_breakdown: statusResult.rows,
        payment_breakdown: paymentResult.rows
      }
    })

  } catch (error) {
    console.error("Get order stats error:", error)

    return res.status(500).json({
      message: "Failed to get order stats"
    })
  }
}

export async function getCustomerOrdersByEmail(
  req: Request,
  res: Response
) {
  try {
    const { email } = req.params

    const result = await pool.query(
      `
      SELECT * FROM orders
      WHERE customer_email = $1
      ORDER BY created_at DESC
      `,
      [email]
    )

    return res.json({
      orders: result.rows
    })

  } catch (error) {
    console.error("Get customer orders by email error:", error)

    return res.status(500).json({
      message: "Failed to get orders"
    })
  }
}
