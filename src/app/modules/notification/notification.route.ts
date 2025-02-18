import express, { Request, Response } from "express";
import * as notificationService from "../notification/notification.service";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

// ✅ Define a custom request type that includes `user`
interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

// ✅ Subscribe to notifications
router.post(
  "/subscribe",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      await notificationService.subscribe(req.user.id, req.body);
      res.status(201).json({ message: "Subscription successful" });
    } catch (error) {
      res.status(500).json({ error: "Subscription failed" });
    }
  }
);

// ✅ Get unread notifications
router.get(
  "/unread",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const notifications = await notificationService.getUnreadNotifications(
        req.user.id
      );
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  }
);

// ✅ Mark notification as read
router.post(
  "/mark-read/:id",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      await notificationService.markNotificationAsRead(req.params.id);
      res.json({ message: "Notification marked as read" });
    } catch (error) {
      res.status(500).json({ error: "Failed to mark notification as read" });
    }
  }
);

// ✅ Sync notifications
router.post("/sync", async (req: Request, res: Response) => {
  try {
    const { userId, title, body, url } = req.body;

    if (!userId || !title || !body) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create a new notification in the database
    await prisma.notification.create({
      data: {
        userId,
        title,
        body,
        url,
      },
    });

    return res
      .status(201)
      .json({ message: "Notification synced successfully" });
  } catch (error) {
    console.error("Error syncing notification:", error);
    return res.status(500).json({ message: "Error syncing notification" });
  }
});

export default router;
