"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.webpush = void 0;
const web_push_1 = __importDefault(require("web-push"));
exports.webpush = web_push_1.default;
const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
if (!vapidPublicKey || !vapidPrivateKey) {
    console.error("VAPID keys are not set. Push notifications will not work.");
}
else {
    console.log("Setting VAPID details with public key:", vapidPublicKey);
    web_push_1.default.setVapidDetails("mailto:ranaarju20@gmail.com", vapidPublicKey, vapidPrivateKey);
}
