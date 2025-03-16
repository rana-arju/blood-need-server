import type { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { HealthRecordService } from "./healthRecord.service";

const getAllHealthRecords = catchAsync(async (req: Request, res: Response) => {
  const result = await HealthRecordService.getAllHealthRecords();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Health records retrieved successfully",
    data: result,
  });
});

const getHealthRecordById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await HealthRecordService.getHealthRecordById(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Health record retrieved successfully",
    data: result,
  });
});

const getHealthRecordsByUserId = catchAsync(
  async (req: Request, res: Response) => {
    const { userId } = req.params;
    const result = await HealthRecordService.getHealthRecordsByUserId(userId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Health records retrieved successfully",
      data: result,
    });
  }
);

const getMyHealthRecords = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id!;
  const result = await HealthRecordService.getHealthRecordsByUserId(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "My health records retrieved successfully",
    data: result,
  });
});

const createHealthRecord = catchAsync(async (req: Request, res: Response) => {
  const result = await HealthRecordService.createHealthRecord(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Health record created successfully",
    data: result,
  });
});

const updateHealthRecord = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await HealthRecordService.updateHealthRecord(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Health record updated successfully",
    data: result,
  });
});

const deleteHealthRecord = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await HealthRecordService.deleteHealthRecord(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Health record deleted successfully",
    data: result,
  });
});

export const HealthRecordController = {
  getAllHealthRecords,
  getHealthRecordById,
  getHealthRecordsByUserId,
  getMyHealthRecords,
  createHealthRecord,
  updateHealthRecord,
  deleteHealthRecord,
};
