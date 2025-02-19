import { PrismaClient, type Review } from "@prisma/client";
import type { IReview, IReviewFilters } from "./review.interface";
import { paginationHelpers } from "../../helpers/paginationHelper";
import { IPaginationOptions } from "../../interface/pagination";
import { IGenericResponse } from "../../interface/common";
import prisma from "../../shared/prisma";



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
  const result = await prisma.review.findUnique({
    where: { id },
  });
  return result;
};

const createReview = async (reviewData: IReview): Promise<Review> => {
  const result = await prisma.review.create({
    data: reviewData,
  });
  return result;
};

const updateReview = async (
  id: string,
  payload: Partial<IReview>
): Promise<Review> => {
  const result = await prisma.review.update({
    where: { id },
    data: payload,
  });
  return result;
};

const deleteReview = async (id: string): Promise<Review> => {
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
