import express from "express";
import * as notificationController from "./notification.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

// Subscribe to notifications
router.post(
  "/subscribe",
  auth("user", "admin", "volunteer", "superadmin"),
  notificationController.subscribe
);

// Get unread notifications
router.get(
  "/unread",
  auth("user", "admin", "volunteer"),
  notificationController.getUnreadNotifications
);

// Mark notification as read
router.patch(
  "/:id",
  auth("user", "admin", "volunteer"),
  notificationController.markAsRead
);

// Sync notifications
router.post(
  "/sync",
  auth("user", "admin", "volunteer"),
  notificationController.syncNotification
);

// Get all notifications
router.get(
  "/",
  auth("user", "admin", "volunteer"),
  notificationController.getNotifications
);

// Unsubscribe from notifications
router.post(
  "/unsubscribe",
  auth("user", "admin", "volunteer"),
  notificationController.unsubscribe
);

export default router;
