import type { Request, Response } from "express";
import { BloodRequestService } from "./bloodRequest.service";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";


export async function getAllBloodRequests(req: Request, res: Response) {
  try {
    const {
      page,
      limit,
      search,
      blood,
      division,
      district,
      upazila,
      requiredDateStart,
      requiredDateEnd,
      createdAtStart,
      createdAtEnd,
      bloodAmountMin,
      bloodAmountMax,
      hemoglobinMin,
      hemoglobinMax,
    } = req.query;

    const params = {
      page: page ? Number.parseInt(page as string) : undefined,
      limit: limit ? Number.parseInt(limit as string) : undefined,
      search: search as string | undefined,
      blood: blood as string | undefined,
      division: division as string | undefined,
      district: district as string | undefined,
      upazila: upazila as string | undefined,
      requiredDateStart: requiredDateStart
        ? new Date(requiredDateStart as string)
        : undefined,
      requiredDateEnd: requiredDateEnd
        ? new Date(requiredDateEnd as string)
        : undefined,
      createdAtStart: createdAtStart
        ? new Date(createdAtStart as string)
        : undefined,
      createdAtEnd: createdAtEnd ? new Date(createdAtEnd as string) : undefined,
      bloodAmountMin: bloodAmountMin
        ? Number.parseInt(bloodAmountMin as string)
        : undefined,
      bloodAmountMax: bloodAmountMax
        ? Number.parseInt(bloodAmountMax as string)
        : undefined,
      hemoglobinMin: hemoglobinMin
        ? Number.parseInt(hemoglobinMin as string)
        : undefined,
      hemoglobinMax: hemoglobinMax
        ? Number.parseInt(hemoglobinMax as string)
        : undefined,
    };

    const { bloodRequests, total } =
      await BloodRequestService.getAllBloodRequests(params);

    res.json({
      success: true,
      data: bloodRequests,
      meta: {
        total,
        page: params.page || 1,
        limit: params.limit || 10,
        totalPages: Math.ceil(total / (params.limit || 10)),
      },
    });
  } catch (error) {
    console.error("Error in getAllBloodRequests:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

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
