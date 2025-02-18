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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notificationService = __importStar(require("../notification/notification.service"));
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
// ✅ Subscribe to notifications
router.post("/subscribe", auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        yield notificationService.subscribe(req.user.id, req.body);
        res.status(201).json({ message: "Subscription successful" });
    }
    catch (error) {
        res.status(500).json({ error: "Subscription failed" });
    }
}));
// ✅ Get unread notifications
router.get("/unread", auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const notifications = yield notificationService.getUnreadNotifications(req.user.id);
        res.json(notifications);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch notifications" });
    }
}));
// ✅ Mark notification as read
router.post("/mark-read/:id", auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield notificationService.markNotificationAsRead(req.params.id);
        res.json({ message: "Notification marked as read" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to mark notification as read" });
    }
}));
// ✅ Sync notifications
router.post("/sync", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, title, body, url } = req.body;
        if (!userId || !title || !body) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        // Create a new notification in the database
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
}));
exports.default = router;
