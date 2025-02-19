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
exports.synceNotifications = void 0;
exports.subscribe = subscribe;
exports.sendNotification = sendNotification;
exports.getUnreadNotifications = getUnreadNotifications;
exports.markNotificationAsRead = markNotificationAsRead;
const web_push_1 = __importDefault(require("web-push"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
function subscribe(userId, subscription) {
    return __awaiter(this, void 0, void 0, function* () {
        yield prisma_1.default.subscription.create({
            data: {
                userId,
                endpoint: subscription.endpoint,
                auth: subscription.keys.auth,
                p256dh: subscription.keys.p256dh,
            },
        });
    });
}
function sendNotification(userId, title, body, url) {
    return __awaiter(this, void 0, void 0, function* () {
        const subscriptions = yield prisma_1.default.subscription.findMany({
            where: { userId },
        });
        const notification = yield prisma_1.default.notification.create({
            data: {
                userId,
                title,
                body,
                url,
            },
        });
        const payload = JSON.stringify({
            title,
            body,
            url,
            notificationId: notification.id,
        });
        for (const sub of subscriptions) {
            try {
                yield web_push_1.default.sendNotification({
                    endpoint: sub.endpoint,
                    keys: {
                        auth: sub.auth,
                        p256dh: sub.p256dh,
                    },
                }, payload);
            }
            catch (error) {
                console.error("Error sending notification:", error);
                // If the subscription is no longer valid, remove it
                if (error.statusCode === 410) {
                    yield prisma_1.default.subscription.delete({ where: { id: sub.id } });
                }
            }
        }
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
const synceNotifications = (userId, title, body, url) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.notification.create({
        data: {
            userId: userId,
            title,
            body,
            url,
        },
    });
});
exports.synceNotifications = synceNotifications;
