import { Router } from "express"
import {
  loginAdmin,
  getAdminProfile
} from "../controllers/admin.controller.js"

import { adminAuth } from "../middleware/adminAuth.js"

const router = Router()

router.post("/login", loginAdmin)

router.get(
  "/profile",
  adminAuth,
  getAdminProfile
)

export default router