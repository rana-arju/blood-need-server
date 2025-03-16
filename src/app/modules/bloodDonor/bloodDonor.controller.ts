import type { Request, Response } from "express";
import { BloodDonorService } from "./bloodDonor.service";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import pick from "../../shared/pick";
import { bloodDonorFilterableFields } from "./bloodDonor.constant";
import { paginationFields } from "../../constants/pagination";

const getAllBloodDonors = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, bloodDonorFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await BloodDonorService.getAllBloodDonors(
    filters,
    paginationOptions
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Blood donors retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getBloodDonorById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BloodDonorService.getBloodDonorById(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Blood donor retrieved successfully",
    data: result,
  });
});
const getBloodDonorUserId = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await BloodDonorService.getBloodDonorByUserId(id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Blood donor retrieved successfully",
      data: result,
    });
  }
);

const createBloodDonor = catchAsync(async (req: Request, res: Response) => {
  
  const result = await BloodDonorService.createBloodDonor(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Blood donor created successfully",
    data: result,
  });
});

const updateBloodDonor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BloodDonorService.updateBloodDonor(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Blood donor updated successfully",
    data: result,
  });
});

const deleteBloodDonor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BloodDonorService.deleteBloodDonor(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Blood donor deleted successfully",
    data: result,
  });
});

export const BloodDonorController = {
  getAllBloodDonors,
  getBloodDonorById,
  createBloodDonor,
  updateBloodDonor,
  deleteBloodDonor,
  getBloodDonorUserId,
};
