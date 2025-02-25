"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscribe = subscribe;
exports.sendNotification = sendNotification;
exports.getUnreadNotifications = getUnreadNotifications;
exports.markNotificationAsRead = markNotificationAsRead;
exports.sendNotificationToMatchingDonors = sendNotificationToMatchingDonors;
const prisma_1 = __importDefault(require("../../shared/prisma"));
const webpush_service_1 = require("./webpush.service");
function isValidSubscription(sub) {
    console.log("Validating subscription:", sub);
    const isValid = sub &&
        typeof sub.endpoint === "string" &&
        sub.endpoint.startsWith("https://") &&
        sub.auth &&
        typeof sub.auth === "string" &&
        sub.p256dh &&
        typeof sub.p256dh === "string";
    if (!isValid) {
        console.log("Invalid subscription details:", {
            hasEndpoint: !!sub.endpoint,
            endpointIsString: typeof sub.endpoint === "string",
            endpointStartsWithHttps: sub.endpoint?.startsWith("https://"),
            hasAuth: !!sub.auth,
            authIsString: typeof sub.auth === "string",
            hasP256dh: !!sub.p256dh,
            p256dhIsString: typeof sub.p256dh === "string",
        });
    }
    return isValid;
}
async function subscribe(userId, subscription) {
    const isExist = await prisma_1.default.subscription.findFirst({
        where: {
            userId,
            endpoint: subscription.endpoint,
        },
    });
    if (isExist) {
        return { message: "Already subscribed." };
    }
    await prisma_1.default.subscription.create({
        data: {
            userId,
            endpoint: subscription.endpoint,
            auth: subscription.keys.auth,
            p256dh: subscription.keys.p256dh,
        },
    });
    return { message: "Subscription successful." };
}
async function sendNotification(userIds, title, body, url) {
    const notifications = await prisma_1.default.notification.createMany({
        data: userIds.map((userId) => ({
            title,
            body,
            url,
            userId,
        })),
    });
    const subscriptions = await prisma_1.default.subscription.findMany({
        where: {
            userId: {
                in: userIds,
            },
        },
    });
    const payload = JSON.stringify({
        title,
        body,
        url,
    });
    const sendPromises = subscriptions.map(async (sub) => {
        console.log("Sending notification to subscription:", sub.endpoint);
        if (!isValidSubscription(sub)) {
            console.log("Invalid subscription, skipping:", sub.id);
            return;
        }
        console.log("Sending notification to subscription:", sub.endpoint);
        try {
            const webpushRes = await webpush_service_1.webpush.sendNotification({
                endpoint: sub.endpoint,
                keys: {
                    auth: sub.auth,
                    p256dh: sub.p256dh,
                },
            }, payload);
            console.log("Notification sent successfully:", webpushRes);
        }
        catch (error) {
            console.error("Error sending notification:", {
                statusCode: error.statusCode,
                headers: error.headers,
                body: error.body,
                endpoint: sub.endpoint,
            });
            if (error.statusCode === 410) {
                console.log("Deleting expired subscription:", sub.id);
                await prisma_1.default.subscription.delete({ where: { id: sub.id } });
            }
        }
    });
    await Promise.all(sendPromises);
    return notifications;
}
async function getUnreadNotifications(userId) {
    return prisma_1.default.notification.findMany({
        where: {
            userId,
            isRead: false,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}
async function markNotificationAsRead(notificationId) {
    await prisma_1.default.notification.update({
        where: { id: notificationId },
        data: { isRead: true },
    });
}
async function sendNotificationToMatchingDonors(bloodRequest) {
    const matchingDonors = await prisma_1.default.user.findMany({
        where: {
            blood: bloodRequest.blood,
            district: bloodRequest.district,
            //donorInfo: {isNot: null},
        },
        select: {
            id: true,
        },
    });
    const donorIds = matchingDonors.map((donor) => donor.id);
    if (donorIds.length > 0) {
        const title = "Urgent Blood Request";
        const body = `A ${bloodRequest.blood} blood donation is needed in ${bloodRequest.district}.`;
        const url = `/request/${bloodRequest.id}`;
        await sendNotification(donorIds, title, body, url);
    }
}
