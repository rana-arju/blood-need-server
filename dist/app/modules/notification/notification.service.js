"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const prisma_1 = __importDefault(require("../../shared/prisma"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const bson_1 = require("bson");
const firebase_config_1 = __importDefault(require("../../config/firebase.config"));
const fcmToken_service_1 = require("./fcmToken.service");
const webpush_service_1 = require("./webpush.service");
const logger_1 = require("../../shared/logger");
// Create a notification for a single user
const createNotification = async (userId, notification) => {
    if (!bson_1.ObjectId.isValid(userId)) {
        throw new AppError_1.default(400, "Invalid user ID format");
    }
    // Check if user exists
    const user = await prisma_1.default.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new AppError_1.default(404, "User not found");
    }
    // Create notification in database
    const dbNotification = await prisma_1.default.notification.create({
        data: {
            userId,
            title: notification.title,
            body: notification.body,
            url: notification.url,
        },
    });
    // Get user's FCM tokens
    const tokens = await fcmToken_service_1.FCMTokenService.getUserTokens(userId);
    if (tokens.length > 0) {
        try {
            // Send FCM notification
            await sendFCMNotification(tokens.map((t) => t.token), notification.title, notification.body, {
                url: notification.url,
                ...notification.data,
            }, notification.imageUrl);
        }
        catch (error) {
            logger_1.logger.error("Error sending FCM notification:", error);
            // Continue even if FCM fails - the notification is still stored in the database
        }
    }
    return dbNotification;
};
// Send notification to all users in a district for a blood request
const notifyDistrictForBloodRequest = async (requestId, district, notification) => {
    if (!bson_1.ObjectId.isValid(requestId)) {
        throw new AppError_1.default(400, "Invalid request ID format");
    }
    // Check if blood request exists
    const bloodRequest = await prisma_1.default.bloodRequest.findUnique({
        where: { id: requestId },
    });
    if (!bloodRequest) {
        throw new AppError_1.default(404, "Blood request not found");
    }
    // Find all users in the district
    const users = await prisma_1.default.user.findMany({
        where: { district },
        select: { id: true },
    });
    const userIds = users.map((user) => user.id);
    // Create recipients array with read status
    const recipients = userIds.map((userId) => ({
        userId,
        isRead: false,
    }));
    // Create or update blood request notification
    // Convert the recipients array to a JSON-compatible format
    const bloodRequestNotification = await prisma_1.default.bloodRequestNotification.upsert({
        where: {
            requestId_district: {
                requestId,
                district,
            },
        },
        update: {
            title: notification.title,
            body: notification.body,
            url: notification.url,
            data: notification.data || {},
            // Convert the recipients array to a JSON object
            recipients: recipients,
            updatedAt: new Date(),
        },
        create: {
            requestId,
            district,
            title: notification.title,
            body: notification.body,
            url: notification.url,
            data: notification.data || {},
            // Convert the recipients array to a JSON object
            recipients: recipients,
        },
    });
    // Get all FCM tokens for users in the district
    const tokens = await fcmToken_service_1.FCMTokenService.getDistrictTokens(district);
    // Track which users received the notification
    const notifiedUserIds = new Set();
    if (tokens.length > 0) {
        try {
            // Send FCM notification
            const fcmResult = await sendFCMNotification(tokens.map((t) => t.token), notification.title, notification.body, {
                requestId,
                url: notification.url,
                notificationId: bloodRequestNotification.id,
                ...notification.data,
            }, notification.imageUrl);
            // Mark tokens that received the notification
            if (fcmResult.successTokens && fcmResult.successTokens.length > 0) {
                // Find users for successful tokens
                const successfulTokens = await prisma_1.default.fCMToken.findMany({
                    where: {
                        token: {
                            in: fcmResult.successTokens,
                        },
                    },
                    select: {
                        userId: true,
                    },
                });
                // Add to notified users set
                successfulTokens.forEach((token) => {
                    notifiedUserIds.add(token.userId);
                });
            }
        }
        catch (error) {
            logger_1.logger.error("Error sending district FCM notification:", error);
        }
    }
    // Try web push for users who didn't get FCM notification
    try {
        // For each user who didn't receive FCM notification, try web push
        for (const userId of userIds) {
            if (!notifiedUserIds.has(userId)) {
                try {
                    await webpush_service_1.WebPushService.sendNotificationToUser(userId, {
                        title: notification.title,
                        body: notification.body,
                        data: {
                            requestId,
                            url: notification.url,
                            notificationId: bloodRequestNotification.id,
                            ...notification.data,
                        },
                    });
                    // Add to notified users
                    notifiedUserIds.add(userId);
                }
                catch (error) {
                    logger_1.logger.error(`Error sending web push to user ${userId}:`, error);
                }
            }
        }
    }
    catch (error) {
        logger_1.logger.error("Error sending web push notifications:", error);
    }
    // Update recipients who received the notification
    if (notifiedUserIds.size > 0) {
        // Get the current recipients from the database
        const currentNotification = await prisma_1.default.bloodRequestNotification.findUnique({
            where: { id: bloodRequestNotification.id },
            select: { recipients: true },
        });
        // Parse the recipients from JSON
        const currentRecipients = currentNotification?.recipients;
        if (!currentRecipients) {
            logger_1.logger.error("Failed to retrieve current recipients");
            return bloodRequestNotification;
        }
        const updatedRecipients = currentRecipients.map((recipient) => {
            if (notifiedUserIds.has(recipient.userId)) {
                return {
                    ...recipient,
                    deliveredAt: new Date(),
                };
            }
            return recipient;
        });
        await prisma_1.default.bloodRequestNotification.update({
            where: { id: bloodRequestNotification.id },
            data: {
                recipients: updatedRecipients,
            },
        });
    }
    return bloodRequestNotification;
};
// Get notifications for a user
const getUserNotifications = async (userId, page = 1, limit = 10) => {
    if (!bson_1.ObjectId.isValid(userId)) {
        throw new AppError_1.default(400, "Invalid user ID format");
    }
    const skip = (page - 1) * limit;
    // Get individual notifications
    const [individualNotifications, individualTotal] = await Promise.all([
        prisma_1.default.notification.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
        }),
        prisma_1.default.notification.count({
            where: { userId },
        }),
    ]);
    // Get all blood request notifications
    const allBloodRequestNotifications = await prisma_1.default.bloodRequestNotification.findMany({
        orderBy: { createdAt: "desc" },
    });
    // Filter notifications where the user is a recipient
    const bloodRequestNotifications = allBloodRequestNotifications.filter((notification) => {
        const recipients = notification.recipients;
        return recipients.some((recipient) => recipient.userId === userId);
    });
    // Transform blood request notifications to match individual notification format
    const transformedBloodRequestNotifications = bloodRequestNotifications.map((notification) => {
        // Parse the recipients from JSON
        const recipients = notification.recipients;
        const userRecipient = recipients.find((r) => r.userId === userId);
        return {
            id: notification.id,
            userId: userId,
            title: notification.title,
            body: notification.body,
            url: notification.url,
            isRead: userRecipient?.isRead || false,
            createdAt: notification.createdAt,
            updatedAt: notification.updatedAt,
            requestId: notification.requestId,
            isBloodRequest: true,
        };
    });
    // Combine both types of notifications
    const allNotifications = [
        ...individualNotifications,
        ...transformedBloodRequestNotifications,
    ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    // Apply pagination to combined results
    const paginatedNotifications = allNotifications.slice(skip, skip + limit);
    const totalNotifications = individualTotal + transformedBloodRequestNotifications.length;
    return {
        data: paginatedNotifications,
        meta: {
            total: totalNotifications,
            page,
            limit,
            totalPages: Math.ceil(totalNotifications / limit),
        },
    };
};
// Mark notification as read
const markNotificationAsRead = async (id, userId) => {
    if (!bson_1.ObjectId.isValid(id) || !bson_1.ObjectId.isValid(userId)) {
        throw new AppError_1.default(400, "Invalid ID format");
    }
    // First, try to find and update individual notification
    const notification = await prisma_1.default.notification.findUnique({
        where: { id },
    });
    if (notification) {
        if (notification.userId !== userId) {
            throw new AppError_1.default(403, "You are not authorized to update this notification");
        }
        return await prisma_1.default.notification.update({
            where: { id },
            data: { isRead: true },
        });
    }
    // If not found, check if it's a blood request notification
    const bloodRequestNotification = await prisma_1.default.bloodRequestNotification.findUnique({
        where: { id },
    });
    if (!bloodRequestNotification) {
        throw new AppError_1.default(404, "Notification not found");
    }
    // Parse the recipients from JSON
    const recipients = bloodRequestNotification.recipients;
    const recipientIndex = recipients.findIndex((r) => r.userId === userId);
    if (recipientIndex === -1) {
        throw new AppError_1.default(403, "You are not a recipient of this notification");
    }
    recipients[recipientIndex].isRead = true;
    recipients[recipientIndex].readAt = new Date();
    // Update the notification with the modified recipients array
    const updatedNotification = await prisma_1.default.bloodRequestNotification.update({
        where: { id },
        data: {
            recipients: recipients,
        },
    });
    // Return a transformed notification object for the specific user
    return {
        id: updatedNotification.id,
        userId: userId,
        title: updatedNotification.title,
        body: updatedNotification.body,
        url: updatedNotification.url,
        isRead: true,
        createdAt: updatedNotification.createdAt,
        updatedAt: updatedNotification.updatedAt,
        requestId: updatedNotification.requestId,
        isBloodRequest: true,
    };
};
// Mark all notifications as read for a user
const markAllNotificationsAsRead = async (userId) => {
    if (!bson_1.ObjectId.isValid(userId)) {
        throw new AppError_1.default(400, "Invalid user ID format");
    }
    // Mark individual notifications as read
    const individualResult = await prisma_1.default.notification.updateMany({
        where: {
            userId,
            isRead: false,
        },
        data: { isRead: true },
    });
    // Get all blood request notifications
    const allBloodRequestNotifications = await prisma_1.default.bloodRequestNotification.findMany();
    // Filter notifications where the user is a recipient
    const bloodRequestNotifications = allBloodRequestNotifications.filter((notification) => {
        const recipients = notification.recipients;
        return recipients.some((recipient) => recipient.userId === userId);
    });
    // Update each blood request notification
    const bloodRequestUpdates = await Promise.all(bloodRequestNotifications.map(async (notification) => {
        // Parse the recipients from JSON
        const recipients = notification.recipients;
        let updated = false;
        const updatedRecipients = recipients.map((recipient) => {
            if (recipient.userId === userId && !recipient.isRead) {
                updated = true;
                return {
                    ...recipient,
                    isRead: true,
                    readAt: new Date(),
                };
            }
            return recipient;
        });
        if (updated) {
            return prisma_1.default.bloodRequestNotification.update({
                where: { id: notification.id },
                data: {
                    recipients: updatedRecipients,
                },
            });
        }
        return null;
    }));
    const bloodRequestResult = bloodRequestUpdates.filter(Boolean).length;
    return {
        individualNotifications: individualResult.count,
        bloodRequestNotifications: bloodRequestResult,
        total: individualResult.count + bloodRequestResult,
    };
};
// Delete a notification
const deleteNotification = async (id, userId) => {
    if (!bson_1.ObjectId.isValid(id) || !bson_1.ObjectId.isValid(userId)) {
        throw new AppError_1.default(400, "Invalid ID format");
    }
    // First, try to find and delete individual notification
    const notification = await prisma_1.default.notification.findUnique({
        where: { id },
    });
    if (notification) {
        if (notification.userId !== userId) {
            throw new AppError_1.default(403, "You are not authorized to delete this notification");
        }
        return await prisma_1.default.notification.delete({
            where: { id },
        });
    }
    // If not found, check if it's a blood request notification
    const bloodRequestNotification = await prisma_1.default.bloodRequestNotification.findUnique({
        where: { id },
    });
    if (!bloodRequestNotification) {
        throw new AppError_1.default(404, "Notification not found");
    }
    // Parse the recipients from JSON
    const recipients = bloodRequestNotification.recipients;
    const updatedRecipients = recipients.filter((r) => r.userId !== userId);
    // If this was the last recipient, delete the notification
    if (updatedRecipients.length === 0) {
        return await prisma_1.default.bloodRequestNotification.delete({
            where: { id },
        });
    }
    // Otherwise, update the notification with the filtered recipients
    const updatedNotification = await prisma_1.default.bloodRequestNotification.update({
        where: { id },
        data: {
            recipients: updatedRecipients,
        },
    });
    return {
        success: true,
        message: "User removed from notification recipients",
    };
};
// Check for missed notifications when user comes online
const checkMissedNotifications = async (userId) => {
    if (!bson_1.ObjectId.isValid(userId)) {
        throw new AppError_1.default(400, "Invalid user ID format");
    }
    // Get user details to find their district
    const user = await prisma_1.default.user.findUnique({
        where: { id: userId },
        select: { district: true },
    });
    if (!user || !user.district) {
        return { missedNotifications: 0 };
    }
    // Get all blood request notifications for the user's district
    const allBloodRequestNotifications = await prisma_1.default.bloodRequestNotification.findMany({
        where: { district: user.district },
    });
    // Filter notifications where the user is a recipient and hasn't received the notification
    const missedNotifications = [];
    const updatedNotifications = [];
    for (const notification of allBloodRequestNotifications) {
        // Parse the recipients from JSON
        const recipients = notification.recipients;
        const userRecipient = recipients.find((r) => r.userId === userId);
        // If user is a recipient and hasn't received the notification
        if (userRecipient && !userRecipient.deliveredAt) {
            missedNotifications.push({
                id: notification.id,
                title: notification.title,
                body: notification.body,
                url: notification.url,
                data: notification.data || {},
                requestId: notification.requestId,
            });
            // Update recipient status to delivered
            const updatedRecipients = recipients.map((recipient) => {
                if (recipient.userId === userId) {
                    return {
                        ...recipient,
                        deliveredAt: new Date(),
                    };
                }
                return recipient;
            });
            // Queue update operation
            updatedNotifications.push(prisma_1.default.bloodRequestNotification.update({
                where: { id: notification.id },
                data: {
                    recipients: updatedRecipients,
                },
            }));
        }
    }
    // Execute all updates in parallel
    if (updatedNotifications.length > 0) {
        await Promise.all(updatedNotifications);
    }
    // Send missed notifications via FCM or Web Push
    if (missedNotifications.length > 0) {
        try {
            // Get user's FCM tokens
            const tokens = await fcmToken_service_1.FCMTokenService.getUserTokens(userId);
            if (tokens.length > 0) {
                // Send FCM notifications for missed notifications
                for (const notification of missedNotifications) {
                    const notificationData = {
                        url: notification.url,
                        requestId: notification.requestId,
                        notificationId: notification.id,
                    };
                    // Safely merge notification.data if it's an object
                    if (notification.data && typeof notification.data === "object") {
                        // Convert JSON value to regular object
                        const dataObj = notification.data;
                        Object.keys(dataObj).forEach((key) => {
                            notificationData[key] = dataObj[key];
                        });
                    }
                    await sendFCMNotification(tokens.map((t) => t.token), notification.title, notification.body, notificationData);
                }
            }
            else {
                // Try web push if no FCM tokens
                for (const notification of missedNotifications) {
                    const notificationData = {
                        url: notification.url,
                        requestId: notification.requestId,
                        notificationId: notification.id,
                    };
                    // Safely merge notification.data if it's an object
                    if (notification.data && typeof notification.data === "object") {
                        // Convert JSON value to regular object
                        const dataObj = notification.data;
                        Object.keys(dataObj).forEach((key) => {
                            notificationData[key] = dataObj[key];
                        });
                    }
                    await webpush_service_1.WebPushService.sendNotificationToUser(userId, {
                        title: notification.title,
                        body: notification.body,
                        data: notificationData,
                    });
                }
            }
        }
        catch (error) {
            logger_1.logger.error(`Error sending missed notifications to user ${userId}:`, error);
        }
    }
    return {
        missedNotifications: missedNotifications.length,
        notifications: missedNotifications,
    };
};
// Helper function to send FCM notification
const sendFCMNotification = async (tokens, title, body, data, imageUrl) => {
    if (!firebase_config_1.default.messaging) {
        throw new Error("Firebase Admin SDK not initialized");
    }
    if (tokens.length === 0) {
        return { successCount: 0, failureCount: 0, successTokens: [] };
    }
    const message = {
        tokens,
        notification: {
            title,
            body,
            imageUrl,
        },
        data: data
            ? Object.fromEntries(Object.entries(data).map(([key, value]) => [key, String(value)]))
            : undefined,
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
    };
    try {
        const response = await firebase_config_1.default.messaging().sendEachForMulticast(message);
        const successTokens = [];
        // Handle failed tokens
        if (response.failureCount > 0) {
            const failedTokens = [];
            response.responses.forEach((resp, idx) => {
                if (!resp.success) {
                    failedTokens.push(tokens[idx]);
                    logger_1.logger.error(`Failed to send notification to token: ${tokens[idx]}`, resp.error);
                    // If token is invalid, remove it from the database
                    if (resp.error?.code === "messaging/invalid-registration-token" ||
                        resp.error?.code === "messaging/registration-token-not-registered") {
                        try {
                            fcmToken_service_1.FCMTokenService.removeToken(tokens[idx]);
                        }
                        catch (error) {
                            logger_1.logger.error(`Error removing invalid token ${tokens[idx]}:`, error);
                        }
                    }
                }
                else {
                    // Add successful token to the list
                    successTokens.push(tokens[idx]);
                }
            });
        }
        else {
            // All tokens were successful
            successTokens.push(...tokens);
        }
        return {
            successCount: response.successCount,
            failureCount: response.failureCount,
            successTokens,
        };
    }
    catch (error) {
        logger_1.logger.error("Error sending FCM notification:", error);
        throw error;
    }
};
exports.NotificationService = {
    createNotification,
    notifyDistrictForBloodRequest,
    getUserNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    checkMissedNotifications,
};
