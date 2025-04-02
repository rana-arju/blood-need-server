"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const notification_controller_1 = require("./notification.controller");
const fcmToken_controller_1 = require("./fcmToken.controller");
const webPush_controller_1 = require("./webPush.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
// FCM Token routes
router.post("/send", (0, auth_1.default)("user", "admin", "superadmin", "volunteer"), notification_controller_1.NotificationController.sendTestNotification);
router.post("/token/register", (0, auth_1.default)("user", "admin", "superadmin", "volunteer"), fcmToken_controller_1.FCMTokenController.registerToken);
router.post("/token/remove", (0, auth_1.default)("user", "admin", "superadmin", "volunteer"), fcmToken_controller_1.FCMTokenController.removeToken);
// Web Push routes
router.get("/web-push/vapid-public-key", webPush_controller_1.WebPushController.getVapidPublicKey);
router.post("/web-push/subscribe", (0, auth_1.default)("user", "admin", "superadmin", "volunteer"), webPush_controller_1.WebPushController.subscribe);
router.post("/web-push/unsubscribe", webPush_controller_1.WebPushController.unsubscribe);
// Notification routes
router.get("/", (0, auth_1.default)("admin", "superadmin", "user", "volunteer"), notification_controller_1.NotificationController.getUserNotifications);
router.get("/check-missed", (0, auth_1.default)("user", "admin", "superadmin", "volunteer"), notification_controller_1.NotificationController.checkMissedNotifications);
router.patch("/read/:id", (0, auth_1.default)("user", "admin", "superadmin", "volunteer"), notification_controller_1.NotificationController.markNotificationAsRead);
router.patch("/read-all", (0, auth_1.default)("user", "admin", "superadmin", "volunteer"), notification_controller_1.NotificationController.markAllNotificationsAsRead);
router.delete("/:id", (0, auth_1.default)("user", "admin", "superadmin", "volunteer"), notification_controller_1.NotificationController.deleteNotification);
exports.NotificationRoutes = router;
