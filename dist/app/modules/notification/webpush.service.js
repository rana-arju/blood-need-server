"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebPushService = void 0;
const web_push_1 = __importDefault(require("web-push"));
const config_1 = __importDefault(require("../../config"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const logger_1 = require("../../shared/logger");
const AppError_1 = __importDefault(require("../../error/AppError"));
// Set VAPID details
web_push_1.default.setVapidDetails(`mailto:${config_1.default.email.from}`, config_1.default.vapid.publicKey, config_1.default.vapid.privateKey);
const saveSubscription = async (userId, subscription) => {
    const { endpoint, keys } = subscription.subscription; // Correctly access the nested subscription object
    try {
        if (!endpoint || !keys?.auth || !keys?.p256dh) {
            throw new AppError_1.default(400, "Invalid subscription");
        }
        const existingSubscription = await prisma_1.default.subscription.findFirst({
            where: { endpoint },
        });
        if (existingSubscription !== null) {
            const result = await prisma_1.default.subscription.update({
                where: { id: existingSubscription.id },
                data: {
                    userId,
                    auth: keys.auth,
                    p256dh: keys.p256dh,
                    updatedAt: new Date(),
                },
            });
            return result;
        }
        const result = await prisma_1.default.subscription.create({
            data: {
                userId,
                endpoint,
                auth: keys.auth,
                p256dh: keys.p256dh,
            },
        });
        return result;
    }
    catch (error) {
        console.error("Error occurred while saving subscription:", error); // Log the actual error
        throw new AppError_1.default(500, "Failed to save web push subscription");
    }
};
// Delete web push subscription
const deleteSubscription = async (endpoint) => {
    return await prisma_1.default.subscription.deleteMany({
        where: {
            endpoint,
        },
    });
};
// Send web push notification
const sendPushNotification = async (subscription, payload) => {
    try {
        return await web_push_1.default.sendNotification(subscription, JSON.stringify(payload));
    }
    catch (error) {
        logger_1.logger.error("Error sending web push notification:", error);
        // If subscription is expired or invalid, delete it
        if (error.statusCode === 404 || error.statusCode === 410) {
            try {
                await deleteSubscription(subscription.endpoint);
            }
            catch (deleteError) {
                logger_1.logger.error("Error deleting invalid subscription:", deleteError);
            }
        }
        throw error;
    }
};
// Send notification to all subscriptions for a user
const sendNotificationToUser = async (userId, payload) => {
    const subscriptions = await prisma_1.default.subscription.findMany({
        where: { userId },
    });
    if (subscriptions.length === 0) {
        return { success: 0, failure: 0 };
    }
    const results = await Promise.allSettled(subscriptions.map((sub) => {
        const subscription = {
            endpoint: sub.endpoint,
            keys: {
                auth: sub.auth,
                p256dh: sub.p256dh,
            },
        };
        return sendPushNotification(subscription, payload);
    }));
    const success = results.filter((r) => r.status === "fulfilled").length;
    const failure = results.filter((r) => r.status === "rejected").length;
    return { success, failure };
};
// Send notification to all users in a district
const sendNotificationToDistrict = async (district, payload) => {
    // Find all users in the district
    const users = await prisma_1.default.user.findMany({
        where: { district },
        select: { id: true },
    });
    if (users.length === 0) {
        return { success: 0, failure: 0 };
    }
    const userIds = users.map((user) => user.id);
    // Find all subscriptions for these users
    const subscriptions = await prisma_1.default.subscription.findMany({
        where: {
            userId: {
                in: userIds,
            },
        },
    });
    if (subscriptions.length === 0) {
        return { success: 0, failure: 0 };
    }
    const results = await Promise.allSettled(subscriptions.map((sub) => {
        const subscription = {
            endpoint: sub.endpoint,
            keys: {
                auth: sub.auth,
                p256dh: sub.p256dh,
            },
        };
        return sendPushNotification(subscription, payload);
    }));
    const success = results.filter((r) => r.status === "fulfilled").length;
    const failure = results.filter((r) => r.status === "rejected").length;
    return { success, failure };
};
exports.WebPushService = {
    saveSubscription,
    deleteSubscription,
    sendPushNotification,
    sendNotificationToUser,
    sendNotificationToDistrict,
};
