import type { Request, Response } from "express"
import { FCMTokenService } from "./fcmToken.service"
import catchAsync from "../../shared/catchAsync"
import sendResponse from "../../shared/sendResponse"

const registerToken = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id!
  const { token, device } = req.body

  if (!token) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "FCM token is required",
    })
  }

  const result = await FCMTokenService.registerToken(userId, token, device)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "FCM token registered successfully",
    data: result,
  })
})

const removeToken = catchAsync(async (req: Request, res: Response) => {
  const { token } = req.body

  if (!token) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "FCM token is required",
    })
  }

  const result = await FCMTokenService.removeToken(token)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "FCM token removed successfully",
    data: result,
  })
})

export const FCMTokenController = {
  registerToken,
  removeToken,
}

