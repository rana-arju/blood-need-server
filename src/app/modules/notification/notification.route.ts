import express from "express";
import { NotificationController } from "./notification.controller";
import { FCMTokenController } from "./fcmToken.controller";
import { WebPushController } from "./webPush.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

// FCM Token routes
router.post(
  "/send",
  auth("user", "admin", "superadmin", "volunteer"),
  NotificationController.sendTestNotification
);

router.post(
  "/token/register",
  auth("user", "admin", "superadmin", "volunteer"),
  FCMTokenController.registerToken
);

router.post(
  "/token/remove",
  auth("user", "admin", "superadmin", "volunteer"),
  FCMTokenController.removeToken
);

// Web Push routes
router.get("/web-push/vapid-public-key", WebPushController.getVapidPublicKey);

router.post(
  "/web-push/subscribe",
  auth("user", "admin", "superadmin", "volunteer"),
  WebPushController.subscribe
);

router.post("/web-push/unsubscribe", WebPushController.unsubscribe);

// Notification routes
router.get(
  "/",
  auth("admin", "superadmin", "user", "volunteer"),
  NotificationController.getUserNotifications
);

router.get(
  "/check-missed",
  auth("user", "admin", "superadmin", "volunteer"),
  NotificationController.checkMissedNotifications
);

router.patch(
  "/read/:id",
  auth("user", "admin", "superadmin", "volunteer"),
  NotificationController.markNotificationAsRead
);

router.patch(
  "/read-all",
  auth("user", "admin", "superadmin", "volunteer"),
  NotificationController.markAllNotificationsAsRead
);

router.delete(
  "/:id",
  auth("user", "admin", "superadmin", "volunteer"),
  NotificationController.deleteNotification
);

export const NotificationRoutes = router;
