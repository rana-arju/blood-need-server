import type { Request, Response } from "express";
import { BloodRequestService } from "./bloodRequest.service";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import pick from "../../shared/pick";
import { bloodRequestFilterableFields } from "./bloodRequest.constant";
import { paginationFields } from "../../constants/pagination";

const getAllBloodRequests = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, bloodRequestFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await BloodRequestService.getAllBloodRequests(
    filters,
    paginationOptions
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Blood requests retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getBloodRequestById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BloodRequestService.getBloodRequestById(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Blood request retrieved successfully",
    data: result,
  });
});

const createBloodRequest = catchAsync(async (req: Request, res: Response) => {
  const result = await BloodRequestService.createBloodRequest(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Blood request created successfully",
    data: result,
  });
});

const updateBloodRequest = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BloodRequestService.updateBloodRequest(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Blood request updated successfully",
    data: result,
  });
});

const deleteBloodRequest = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BloodRequestService.deleteBloodRequest(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Blood request deleted successfully",
    data: result,
  });
});

export const BloodRequestController = {
  getAllBloodRequests,
  getBloodRequestById,
  createBloodRequest,
  updateBloodRequest,
  deleteBloodRequest,
};
