import type { Request, Response, NextFunction } from "express";
import { NotificationService } from "../modules/notification/notification.service";

export const checkMissedNotifications = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Only check for missed notifications if user is authenticated
    if (req.user?.id) {
      // Check for missed notifications in the background
      NotificationService.checkMissedNotifications(req.user.id)
        .then((result) => {
          if (result.missedNotifications > 0) {
            console.log(
              `Sent ${result.missedNotifications} missed notifications to user ${req.user?.id}`
            );
          }
        })
        .catch((error) => {
          console.error("Error checking missed notifications:", error);
        });
    }

    // Continue with the request regardless of notification check
    next();
  } catch (error) {
    // Don't block the request if there's an error checking notifications
    console.error("Error in checkMissedNotifications middleware:", error);
    next();
  }
};
