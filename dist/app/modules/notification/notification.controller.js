"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unsubscribe = exports.subscribe = exports.syncNotification = exports.getUnreadNotifications = exports.markAsRead = exports.getNotifications = void 0;
const client_1 = require("@prisma/client");
const notificationService = __importStar(require("./notification.service"));
const prisma = new client_1.PrismaClient();
const getNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Assuming you set user info in auth middleware
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const notifications = yield prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
        res.json(notifications);
    }
    catch (error) {
        res.status(500).json({ error: "Error fetching notifications" });
    }
});
exports.getNotifications = getNotifications;
const markAsRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const updatedNotification = yield prisma.notification.updateMany({
            where: { id, userId },
            data: { isRead: true },
        });
        if (updatedNotification.count === 0) {
            return res.status(404).json({ error: "Notification not found" });
        }
        res.json({ message: "Notification marked as read" });
    }
    catch (error) {
        res.status(500).json({ error: "Error marking notification as read" });
    }
});
exports.markAsRead = markAsRead;
const getUnreadNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const notifications = yield notificationService.getUnreadNotifications(userId);
        res.json(notifications);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch unread notifications" });
    }
});
exports.getUnreadNotifications = getUnreadNotifications;
const syncNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, title, body, url } = req.body;
        if (!userId || !title || !body) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        yield prisma.notification.create({
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
    }
    catch (error) {
        console.error("Error syncing notification:", error);
        return res.status(500).json({ message: "Error syncing notification" });
    }
});
exports.syncNotification = syncNotification;
const subscribe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const { subscription } = req.body;
        yield prisma.subscription.create({
            data: {
                userId,
                endpoint: subscription.endpoint,
                auth: subscription.keys.auth,
                p256dh: subscription.keys.p256dh,
            },
        });
        res.status(201).json({ message: "Subscription successful" });
    }
    catch (error) {
        res.status(500).json({ error: "Error subscribing to notifications" });
    }
});
exports.subscribe = subscribe;
const unsubscribe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        yield prisma.subscription.deleteMany({
            where: { userId },
        });
        res.json({ message: "Unsubscribed from notifications" });
    }
    catch (error) {
        res.status(500).json({ error: "Error unsubscribing from notifications" });
    }
});
exports.unsubscribe = unsubscribe;
