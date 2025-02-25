import type { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import pick from "../../shared/pick";
import { reviewFilterableFields } from "./review.constant";
import { paginationFields } from "../../constants/pagination";
import { ReviewService } from "./review.service";

const getAllReviews = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, reviewFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await ReviewService.getAllReviews(filters, paginationOptions);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Reviews retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getReviewById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ReviewService.getReviewById(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Review retrieved successfully",
    data: result,
  });
});

const createReview = catchAsync(async (req: Request, res: Response) => {
  const id = req.user?.id;
  if (!id) {
    sendResponse(res, {
      statusCode: 401,
      success: false,
      message: "Unauthorized",
    });
    return;
    
  }
  const result = await ReviewService.createReview(req.body, id);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Review created successfully",
    data: result,
  });
});

const updateReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ReviewService.updateReview(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Review updated successfully",
    data: result,
  });
});

const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ReviewService.deleteReview(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Review deleted successfully",
    data: result,
  });
});

export const ReviewController = {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
};
