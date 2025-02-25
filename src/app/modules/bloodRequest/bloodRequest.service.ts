import { PrismaClient, type BloodRequest } from "@prisma/client";
import type {
  IBloodRequest,
  IBloodRequestFilters,
} from "./bloodRequest.interface";
import { paginationHelpers } from "../../helpers/paginationHelper";
import { IPaginationOptions } from "../../interface/pagination";
import { IGenericResponse } from "../../interface/common";
import * as notificationService from "../notification/notification.service";
import prisma from "../../shared/prisma";
import AppError from "../../error/AppError";
import { ObjectId } from "bson";

const getAllBloodRequests = async (
  filters: IBloodRequestFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<BloodRequest[]>> => {
  const { searchTerm, bloodType, urgency, status } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: ["location"].map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (bloodType) {
    andConditions.push({ bloodType });
  }

  if (urgency) {
    andConditions.push({ urgency });
  }

  if (status) {
    andConditions.push({ status });
  }

  const whereConditions =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.bloodRequest.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.bloodRequest.count({ where: whereConditions });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getBloodRequestById = async (
  id: string
): Promise<BloodRequest | null> => {
  if (!ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid blood request ID format");
  }
  const isExist = await prisma.bloodRequest.findUnique({ where: { id } });

  if (!isExist) {
    throw new AppError(404, "Blood request not found");
  }
  const result = await prisma.bloodRequest.findUnique({
    where: { id },
  });
  return result;
};
const deleteBloodRequest = async (id: string): Promise<BloodRequest> => {
  if (!ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid blood request ID format");
  }
  const isExist = await prisma.bloodRequest.findUnique({ where: { id } });

  if (!isExist) {
    throw new AppError(404, "Blood request not found");
  }
  const result = await prisma.bloodRequest.delete({
    where: { id },
  });
  return result;
};
const updateBloodRequest = async (
  id: string,
  payload: Partial<IBloodRequest>
): Promise<BloodRequest> => {
  if (!ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid blood request ID format");
  }
  const isExist = await prisma.bloodRequest.findUnique({ where: { id } });

  if (!isExist) {
    throw new AppError(404, "Blood request not found");
  }
  const result = await prisma.bloodRequest.update({
    where: { id },
    data: payload,
  });
  return result;
};

export const createBloodRequest = async (
  bloodRequestData: any
): Promise<any> => {
  const result = await prisma.bloodRequest.create({
    data: bloodRequestData,
  });

  // Send notifications to matching donors
  await notificationService.sendNotificationToMatchingDonors(result);

  return result;
};

export const BloodRequestService = {
  getAllBloodRequests,
  getBloodRequestById,
  createBloodRequest,
  updateBloodRequest,
  deleteBloodRequest,
};
