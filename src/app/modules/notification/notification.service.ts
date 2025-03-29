import prisma from "../../shared/prisma"
import AppError from "../../error/AppError"
import { ObjectId } from "bson"
import admin from "../../config/firebase.config"
import { FCMTokenService } from "./fcmToken.service"
import { logger } from "../../shared/logger"

interface NotificationData {
  title: string
  body: string
  url?: string
  imageUrl?: string
  data?: Record<string, string>
}

// Create a notification for a single user
const createNotification = async (userId: string, notification: NotificationData): Promise<any> => {
  if (!ObjectId.isValid(userId)) {
    throw new AppError(400, "Invalid user ID format")
  }

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) {
    throw new AppError(404, "User not found")
  }

  // Create notification in database
  const dbNotification = await prisma.notification.create({
    data: {
      userId,
      title: notification.title,
      body: notification.body,
      url: notification.url,
    },
  })

  // Get user's FCM tokens
  const tokens = await FCMTokenService.getUserTokens(userId)

  if (tokens.length > 0) {
    try {
      // Send FCM notification
      await sendFCMNotification(
        tokens.map((t) => t.token),
        notification.title,
        notification.body,
        {
          url: notification.url,
          ...notification.data,
        },
        notification.imageUrl,
      )
    } catch (error) {
      logger.error("Error sending FCM notification:", error)
      // Continue even if FCM fails - the notification is still stored in the database
    }
  }

  return dbNotification
}

// Send notification to all users in a district for a blood request
const notifyDistrictForBloodRequest = async (
  requestId: string,
  district: string,
  notification: NotificationData,
): Promise<any> => {
  if (!ObjectId.isValid(requestId)) {
    throw new AppError(400, "Invalid request ID format")
  }

  // Check if blood request exists
  const bloodRequest = await prisma.bloodRequest.findUnique({
    where: { id: requestId },
  })

  if (!bloodRequest) {
    throw new AppError(404, "Blood request not found")
  }

  // Find all users in the district
  const users = await prisma.user.findMany({
    where: { district },
    select: { id: true },
  })

  const userIds = users.map((user) => user.id)

  // Create or update district notification
  const districtNotification = await prisma.districtNotification.upsert({
    where: { district },
    update: {
      userIds,
      requestId,
      title: notification.title,
      body: notification.body,
      data: notification.data ? notification.data : {},
      sentAt: new Date(),
    },
    create: {
      district,
      userIds,
      requestId,
      title: notification.title,
      body: notification.body,
      data: notification.data ? notification.data : {},
    },
  })

  // Get all FCM tokens for users in the district
  const tokens = await FCMTokenService.getDistrictTokens(district)

  if (tokens.length > 0) {
    try {
      // Send FCM notification
      await sendFCMNotification(
        tokens.map((t) => t.token),
        notification.title,
        notification.body,
        {
          requestId,
          url: notification.url,
          ...notification.data,
        },
        notification.imageUrl,
      )
    } catch (error) {
      logger.error("Error sending district FCM notification:", error)
      // Continue even if FCM fails - the notification is still stored in the database
    }
  }

  // Also create individual notifications for each user
  for (const userId of userIds) {
    try {
      await prisma.notification.create({
        data: {
          userId,
          title: notification.title,
          body: notification.body,
          url: notification.url,
        },
      })
    } catch (error) {
      logger.error(`Error creating notification for user ${userId}:`, error)
    }
  }

  return districtNotification
}

// Get notifications for a user
const getUserNotifications = async (userId: string, page = 1, limit = 10): Promise<any> => {
  if (!ObjectId.isValid(userId)) {
    throw new AppError(400, "Invalid user ID format")
  }

  const skip = (page - 1) * limit

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.notification.count({
      where: { userId },
    }),
  ])

  return {
    data: notifications,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  }
}

// Mark notification as read
const markNotificationAsRead = async (id: string, userId: string): Promise<any> => {
  if (!ObjectId.isValid(id) || !ObjectId.isValid(userId)) {
    throw new AppError(400, "Invalid ID format")
  }

  const notification = await prisma.notification.findUnique({
    where: { id },
  })

  if (!notification) {
    throw new AppError(404, "Notification not found")
  }

  if (notification.userId !== userId) {
    throw new AppError(403, "You are not authorized to update this notification")
  }

  return await prisma.notification.update({
    where: { id },
    data: { isRead: true },
  })
}

// Mark all notifications as read for a user
const markAllNotificationsAsRead = async (userId: string): Promise<any> => {
  if (!ObjectId.isValid(userId)) {
    throw new AppError(400, "Invalid user ID format")
  }

  return await prisma.notification.updateMany({
    where: {
      userId,
      isRead: false,
    },
    data: { isRead: true },
  })
}

// Delete a notification
const deleteNotification = async (id: string, userId: string): Promise<any> => {
  if (!ObjectId.isValid(id) || !ObjectId.isValid(userId)) {
    throw new AppError(400, "Invalid ID format")
  }

  const notification = await prisma.notification.findUnique({
    where: { id },
  })

  if (!notification) {
    throw new AppError(404, "Notification not found")
  }

  if (notification.userId !== userId) {
    throw new AppError(403, "You are not authorized to delete this notification")
  }

  return await prisma.notification.delete({
    where: { id },
  })
}

// Helper function to send FCM notification
const sendFCMNotification = async (
  tokens: string[],
  title: string,
  body: string,
  data?: Record<string, any>,
  imageUrl?: string,
): Promise<any> => {
  if (!admin.messaging) {
    throw new Error("Firebase Admin SDK not initialized")
  }

  if (tokens.length === 0) {
    return { success: 0, failure: 0 }
  }

  const message: admin.messaging.MulticastMessage = {
    tokens,
    notification: {
      title,
      body,
      imageUrl,
    },
    data: data ? Object.fromEntries(Object.entries(data).map(([key, value]) => [key, String(value)])) : undefined,
    android: {
      priority: "high",
      notification: {
        sound: "default",
        clickAction: "FLUTTER_NOTIFICATION_CLICK",
      },
    },
    apns: {
      payload: {
        aps: {
          sound: "default",
          badge: 1,
        },
      },
    },
    webpush: {
      notification: {
        icon: "/icons/icon-192x192.png",
        badge: "/icons/icon-192x192.png",
      },
      fcmOptions: {
        link: data?.url,
      },
    },
  }

  try {
    const response = await admin.messaging().sendEachForMulticast(message)

    // Handle failed tokens
    if (response.failureCount > 0) {
      const failedTokens: string[] = []
      response.responses.forEach((resp:any, idx:number) => {
        if (!resp.success) {
          failedTokens.push(tokens[idx])
          logger.error(`Failed to send notification to token: ${tokens[idx]}`, resp.error)

          // If token is invalid, remove it from the database
          if (
            resp.error?.code === "messaging/invalid-registration-token" ||
            resp.error?.code === "messaging/registration-token-not-registered"
          ) {
            try {
              FCMTokenService.removeToken(tokens[idx])
            } catch (error) {
              logger.error(`Error removing invalid token ${tokens[idx]}:`, error)
            }
          }
        }
      })
    }

    return {
      success: response.successCount,
      failure: response.failureCount,
    }
  } catch (error) {
    logger.error("Error sending FCM notification:", error)
    throw error
  }
}

export const NotificationService = {
  createNotification,
  notifyDistrictForBloodRequest,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
}

