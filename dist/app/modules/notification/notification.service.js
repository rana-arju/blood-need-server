"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    var _a;
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
            endpointStartsWithHttps: (_a = sub.endpoint) === null || _a === void 0 ? void 0 : _a.startsWith("https://"),
            hasAuth: !!sub.auth,
            authIsString: typeof sub.auth === "string",
            hasP256dh: !!sub.p256dh,
            p256dhIsString: typeof sub.p256dh === "string",
        });
    }
    return isValid;
}
function subscribe(userId, subscription) {
    return __awaiter(this, void 0, void 0, function* () {
        const isExist = yield prisma_1.default.subscription.findFirst({
            where: {
                userId,
                endpoint: subscription.endpoint,
            },
        });
        if (isExist) {
            return { message: "Already subscribed." };
        }
        yield prisma_1.default.subscription.create({
            data: {
                userId,
                endpoint: subscription.endpoint,
                auth: subscription.keys.auth,
                p256dh: subscription.keys.p256dh,
            },
        });
        return { message: "Subscription successful." };
    });
}
function sendNotification(userIds, title, body, url) {
    return __awaiter(this, void 0, void 0, function* () {
        const notifications = yield prisma_1.default.notification.createMany({
            data: userIds.map((userId) => ({
                title,
                body,
                url,
                userId,
            })),
        });
        const subscriptions = yield prisma_1.default.subscription.findMany({
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
        const sendPromises = subscriptions.map((sub) => __awaiter(this, void 0, void 0, function* () {
            console.log("Sending notification to subscription:", sub.endpoint);
            if (!isValidSubscription(sub)) {
                console.log("Invalid subscription, skipping:", sub.id);
                return;
            }
            console.log("Sending notification to subscription:", sub.endpoint);
            try {
                const webpushRes = yield webpush_service_1.webpush.sendNotification({
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
                    yield prisma_1.default.subscription.delete({ where: { id: sub.id } });
                }
            }
        }));
        yield Promise.all(sendPromises);
        return notifications;
    });
}
function getUnreadNotifications(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.default.notification.findMany({
            where: {
                userId,
                isRead: false,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    });
}
function markNotificationAsRead(notificationId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield prisma_1.default.notification.update({
            where: { id: notificationId },
            data: { isRead: true },
        });
    });
}
function sendNotificationToMatchingDonors(bloodRequest) {
    return __awaiter(this, void 0, void 0, function* () {
        const matchingDonors = yield prisma_1.default.user.findMany({
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
            yield sendNotification(donorIds, title, body, url);
        }
    });
}
