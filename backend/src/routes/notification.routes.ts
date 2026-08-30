import { Router } from "express"
import {
  getNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  createNotification
} from "../controllers/notification.controller.js"

const router = Router()

router.get("/", getNotifications)

router.get("/unread-count", getUnreadCount)

router.put("/:id/read", markNotificationRead)

router.put("/mark-all-read", markAllNotificationsRead)

router.post("/", createNotification)

export default router
