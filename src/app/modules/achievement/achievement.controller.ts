import type { Request, Response } from "express";
import { AchievementService } from "./achievement.service";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";



const getMyAchievements = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id!;
  const result = await AchievementService.getUserAchievements(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "My achievements retrieved successfully",
    data: result,
  });
});

const initializeMyAchievements = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.id!;
    const result = await AchievementService.initializeUserAchievements(userId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Achievements initialized successfully",
      data: result,
    });
  }
);

export const AchievementController = {
  
  getMyAchievements,
  initializeMyAchievements,
};
