import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import * as notificationService from "./notification.service";

const prisma = new PrismaClient();

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id; // Assuming you set user info in auth middleware
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Error fetching notifications" });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req?.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const updatedNotification = await prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true },
    });

    if (updatedNotification.count === 0) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ error: "Error marking notification as read" });
  }
};

export const getUnreadNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const notifications = await notificationService.getUnreadNotifications(
      userId
    );
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch unread notifications" });
  }
};

export const syncNotification = async (req: Request, res: Response) => {
  try {
    const { userId, title, body, url } = req.body;

    if (!userId || !title || !body) {
      return res.status(400).json({ message: "Missing required fields" });
    }

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
};

export const subscribe = async (req: Request, res: Response) => {
  try {
    const userId = req?.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { subscription } = req.body;

    await prisma.subscription.create({
      data: {
        userId,
        endpoint: subscription.endpoint,
        auth: subscription.keys.auth,
        p256dh: subscription.keys.p256dh,
      },
    });

    res.status(201).json({ message: "Subscription successful" });
  } catch (error) {
    res.status(500).json({ error: "Error subscribing to notifications" });
  }
};

export const unsubscribe = async (req: Request, res: Response) => {
  try {
    const userId = req?.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    await prisma.subscription.deleteMany({
      where: { userId },
    });

    res.json({ message: "Unsubscribed from notifications" });
  } catch (error) {
    res.status(500).json({ error: "Error unsubscribing from notifications" });
  }
};
