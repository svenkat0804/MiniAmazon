import { Router } from "express"
import {
  loginAdmin,
  getAdminProfile,
  updateAdminProfile
} from "../controllers/admin.controller.js"

import { adminAuth } from "../middleware/adminAuth.js"

const router = Router()

router.post("/login", loginAdmin)

router.get(
  "/profile",
  adminAuth,
  getAdminProfile
)

router.put(
  "/profile",
  adminAuth,
  updateAdminProfile
)

export default router