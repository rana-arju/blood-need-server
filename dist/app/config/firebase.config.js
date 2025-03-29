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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin = __importStar(require("firebase-admin"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Check if we're running on Vercel
const isVercel = process.env.VERCEL_REGION || process.env.VERCEL_URL;
let serviceAccount;
// Handle service account differently based on environment
if (isVercel) {
    // On Vercel, use environment variable
    try {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || "{}");
    }
    catch (error) {
        console.error("Error parsing Firebase service account from env:", error);
        serviceAccount = undefined;
    }
}
else {
    // In local development, try to read from file
    try {
        const serviceAccountPath = path_1.default.join(process.cwd(), "firebase-service-account.json");
        if (fs_1.default.existsSync(serviceAccountPath)) {
            serviceAccount = require(serviceAccountPath);
        }
    }
    catch (error) {
        console.error("Error reading Firebase service account file:", error);
        serviceAccount = undefined;
    }
}
// Initialize Firebase Admin SDK
if (!admin.apps.length) {
    try {
        if (serviceAccount) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                // databaseURL: config.firebase.databaseURL,
            });
            console.log("Firebase Admin SDK initialized successfully");
        }
        else {
            console.warn("Firebase service account not found, FCM notifications will not work");
        }
    }
    catch (error) {
        console.error("Error initializing Firebase Admin SDK:", error);
    }
}
exports.default = admin;
