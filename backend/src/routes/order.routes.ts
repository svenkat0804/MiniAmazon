import { Router } from "express"
import { adminAuth } from "../middleware/adminAuth.js"
import {
  getOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
  createOrder,
  getOrderStats,
  getCustomerOrdersByEmail
} from "../controllers/order.controller.js"

const router = Router()

router.get("/", adminAuth, getOrders)
router.get("/stats", adminAuth, getOrderStats)
router.get("/:id", adminAuth, getOrderById)
router.put("/:id/status", adminAuth, updateOrderStatus)
router.put("/:id/payment", adminAuth, updatePaymentStatus)
router.post("/", createOrder)
router.get("/customer/:email", getCustomerOrdersByEmail)

export default router
