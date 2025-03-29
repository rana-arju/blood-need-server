import type { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import config from "../../config";
import { WebPushService } from "./webpush.service";
import AppError from "../../error/AppError";

const getVapidPublicKey = catchAsync(async (req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "VAPID public key retrieved successfully",
    data: { publicKey: config.vapid.publicKey },
  });
});

const subscribe = catchAsync(async (req: Request, res: Response) => {
  if (!req.user?.id) {
    throw new AppError(400, "User ID is required");
  }
  const userId = req.user.id;
  const subscription = req.body;


  try {
    const result = await WebPushService.saveSubscription(userId, subscription);
console.log("Asdfasdf", result);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Web push subscription saved successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error saving subscription:", error); // Log the error
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Failed to save web push subscription",
      data: null,
    });
  }
}); // Save web push subscription

const unsubscribe = catchAsync(async (req: Request, res: Response) => {
  const { endpoint } = req.body;

  if (!endpoint) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Endpoint is required",
    });
  }

  const result = await WebPushService.deleteSubscription(endpoint);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Web push subscription removed successfully",
    data: result,
  });
});

export const WebPushController = {
  getVapidPublicKey,
  subscribe,
  unsubscribe,
};
