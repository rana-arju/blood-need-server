import type { Request, Response } from "express"
import { NotificationService } from "./notification.service"
import catchAsync from "../../shared/catchAsync"
import sendResponse from "../../shared/sendResponse"
import pick from "../../shared/pick"
import { paginationFields } from "../../constants/pagination"

const getUserNotifications = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id!
  
  const paginationOptions = pick(req.query, paginationFields)

  const page = Number(paginationOptions.page || 1)
  const limit = Number(paginationOptions.limit || 10)

  const result = await NotificationService.getUserNotifications(userId, page, limit)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Notifications retrieved successfully",
    meta: result.meta,
    data: result.data,
  })
})

const markNotificationAsRead = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id!
  const { id } = req.params

  const result = await NotificationService.markNotificationAsRead(id, userId)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Notification marked as read",
    data: result,
  })
})

const markAllNotificationsAsRead = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id!

  const result = await NotificationService.markAllNotificationsAsRead(userId)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All notifications marked as read",
    data: result,
  })
})

const deleteNotification = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id!
  const { id } = req.params

  const result = await NotificationService.deleteNotification(id, userId)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Notification deleted successfully",
    data: result,
  })
})

export const NotificationController = {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
}

