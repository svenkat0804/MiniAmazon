import { Router } from "express"
import {
  getSiteSettings,
  updateSiteSetting
} from "../controllers/site.controller.js"

import { adminAuth } from "../middleware/adminAuth.js"

const router = Router()

router.get("/settings", getSiteSettings)

router.put(
  "/settings",
  adminAuth,
  updateSiteSetting
)

export default router
