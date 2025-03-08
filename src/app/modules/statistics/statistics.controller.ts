import type { Request, Response } from "express";
import { StatisticsService } from "./statistics.service";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";

const getStatistics = catchAsync(async (req: Request, res: Response) => {
  const result = await StatisticsService.getStatistics();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Statistics retrieved successfully",
    data: result,
  });
});

export const StatisticsController = {
  getStatistics,
};
