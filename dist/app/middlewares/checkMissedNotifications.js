"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkMissedNotifications = void 0;
const notification_service_1 = require("../modules/notification/notification.service");
const checkMissedNotifications = async (req, res, next) => {
    try {
        // Only check for missed notifications if user is authenticated
        if (req.user?.id) {
            // Check for missed notifications in the background
            notification_service_1.NotificationService.checkMissedNotifications(req.user.id)
                .then((result) => {
                if (result.missedNotifications > 0) {
                    console.log(`Sent ${result.missedNotifications} missed notifications to user ${req.user?.id}`);
                }
            })
                .catch((error) => {
                console.error("Error checking missed notifications:", error);
            });
        }
        // Continue with the request regardless of notification check
        next();
    }
    catch (error) {
        // Don't block the request if there's an error checking notifications
        console.error("Error in checkMissedNotifications middleware:", error);
        next();
    }
};
exports.checkMissedNotifications = checkMissedNotifications;
