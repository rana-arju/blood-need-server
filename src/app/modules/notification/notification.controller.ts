import type { Request, Response } from "express";
import { NotificationService } from "./notification.service";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import pick from "../../shared/pick";
import { paginationFields } from "../../constants/pagination";

const getUserNotifications = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id!;

  const paginationOptions = pick(req.query, paginationFields);

  const page = Number(paginationOptions.page || 1);
  const limit = Number(paginationOptions.limit || 10);

  const result = await NotificationService.getUserNotifications(
    userId,
    page,
    limit
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Notifications retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const markNotificationAsRead = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.id!;
    const { id } = req.params;

    const result = await NotificationService.markNotificationAsRead(id, userId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Notification marked as read",
      data: result,
    });
  }
);

const markAllNotificationsAsRead = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.id!;

    const result = await NotificationService.markAllNotificationsAsRead(userId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "All notifications marked as read",
      data: result,
    });
  }
);

const deleteNotification = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id!;
  const { id } = req.params;

  const result = await NotificationService.deleteNotification(id, userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Notification deleted successfully",
    data: result,
  });
});
export const sendTestNotification = async (req: Request, res: Response) => {
  try {
    const id = req.user?.id
    const { token, title, body,data } = req.body;
    console.log("asdfRana", req.body);
    

    if (!id || !title || !body) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Save the notification to the database
    const notification = await NotificationService.createNotification(id!, {
      title,
      body,
      data
    });

    return res.status(200).json({
      message: "Notification sent successfully",
      notification,
    });
  } catch (error) {
    console.error("Error sending notification:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
export const NotificationController = {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
};
