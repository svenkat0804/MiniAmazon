import { Router } from "express"
import { adminAuth } from "../middleware/adminAuth.js"
import {
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  createComplaint
} from "../controllers/complaint.controller.js"

const router = Router()

router.get("/", adminAuth, getComplaints)
router.get("/:id", adminAuth, getComplaintById)
router.put("/:id/status", adminAuth, updateComplaintStatus)
router.post("/", createComplaint)

export default router
