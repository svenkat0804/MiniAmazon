import { Router } from "express"
import { adminAuth } from "../middleware/adminAuth.js"
import {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  getCustomerOrders
} from "../controllers/customer.controller.js"

const router = Router()

router.get("/", adminAuth, getCustomers)
router.get("/:id", adminAuth, getCustomerById)
router.post("/", adminAuth, createCustomer)
router.put("/:id", adminAuth, updateCustomer)
router.get("/:id/orders", adminAuth, getCustomerOrders)

export default router
