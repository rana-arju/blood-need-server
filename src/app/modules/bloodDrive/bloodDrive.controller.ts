import type { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import pick from "../../shared/pick";
import { bloodDriveFilterableFields } from "./bloodDrive.constant";
import { BloodDriveService } from "./bloodDrive.service";
import { paginationFields } from "../../constants/pagination";


const getAllBloodDrives = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, bloodDriveFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await BloodDriveService.getAllBloodDrives(
    filters,
    paginationOptions
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Blood drives retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getBloodDriveById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BloodDriveService.getBloodDriveById(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Blood drive retrieved successfully",
    data: result,
  });
});

const createBloodDrive = catchAsync(async (req: Request, res: Response) => {
  const result = await BloodDriveService.createBloodDrive(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Blood drive created successfully",
    data: result,
  });
});

const updateBloodDrive = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BloodDriveService.updateBloodDrive(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Blood drive updated successfully",
    data: result,
  });
});

const deleteBloodDrive = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BloodDriveService.deleteBloodDrive(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Blood drive deleted successfully",
    data: result,
  });
});

export const BloodDriveController = {
  getAllBloodDrives,
  getBloodDriveById,
  createBloodDrive,
  updateBloodDrive,
  deleteBloodDrive,
};
