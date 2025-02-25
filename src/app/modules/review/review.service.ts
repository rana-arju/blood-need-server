import { PrismaClient, type Review } from "@prisma/client";
import type { IReview, IReviewFilters } from "./review.interface";
import { paginationHelpers } from "../../helpers/paginationHelper";
import { IPaginationOptions } from "../../interface/pagination";
import { IGenericResponse } from "../../interface/common";
import prisma from "../../shared/prisma";
import AppError from "../../error/AppError";
import { ObjectId } from "bson";

const getAllReviews = async (
  filters: IReviewFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Review[]>> => {
  const { searchTerm, rating } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: ["comment"].map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (rating) {
    andConditions.push({
      rating: {
        equals: rating,
      },
    });
  }

  const whereConditions =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.review.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.review.count({ where: whereConditions });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getReviewById = async (id: string): Promise<Review | null> => {
  if (!ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid review ID format");
  }
  const isExist = await prisma.review.findUnique({ where: { id } });

  if (!isExist) {
    throw new AppError(404, "Review not found");
  }
  const result = await prisma.review.findUnique({
    where: { id },
  });
  return result;
};

const createReview = async (
  reviewData: IReview,
  id: string
): Promise<Review> => {
  const modified = {
    ...reviewData,
    userId: id,
  };
  const result = await prisma.review.create({
    data: modified,
  });
  return result;
};

const updateReview = async (
  id: string,
  payload: Partial<IReview>
): Promise<Review> => {
  // ✅ Validate if `id` is a valid MongoDB ObjectId
  if (!ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid review ID format");
  }
  const isExist = await prisma.review.findUnique({ where: { id } });

  if (!isExist) {
    throw new AppError(404, "Review not found");
  }
  const result = await prisma.review.update({
    where: { id },
    data: payload,
  });
  return result;
};

const deleteReview = async (id: string): Promise<Review> => {
  if (!ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid review ID format");
  }
  const isExist = await prisma.review.findUnique({ where: { id } });

  if (!isExist) {
    throw new AppError(404, "Review not found");
  }
  const result = await prisma.review.delete({
    where: { id },
  });
  return result;
};

export const ReviewService = {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
};
