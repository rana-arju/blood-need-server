import { Prisma, type BloodRequest } from "@prisma/client";
import type { IBloodRequest } from "./bloodRequest.interface";

import * as notificationService from "../notification/notification.service";
import prisma from "../../shared/prisma";
import AppError from "../../error/AppError";
import { ObjectId } from "bson";

interface GetAllBloodRequestsParams {
  page?: number;
  limit?: number;
  search?: string;
  blood?: string;
  division?: string;
  district?: string;
  upazila?: string;
  requiredDateStart?: Date;
  requiredDateEnd?: Date;
  createdAtStart?: Date;
  createdAtEnd?: Date;
  bloodAmountMin?: number;
  bloodAmountMax?: number;
  hemoglobinMin?: number;
  hemoglobinMax?: number;
}
 async function getAllBloodRequests(
  params: GetAllBloodRequestsParams
): Promise<{ bloodRequests: BloodRequest[]; total: number }> {
  const {
    page = 1,
    limit = 10,
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
  } = params;

  // Get current date and time
  const now = new Date();

  const where: Prisma.BloodRequestWhereInput = {
    AND: [
      // Exclude past requests
      {
        OR: [
          { requiredDate: { gt: new Date() } },
          {
            AND: [
              { requiredDate: { equals: new Date() } },
              { requireTime: { gt: new Date() } },
            ],
          },
        ],
      },

      // Search
      search
        ? {
            OR: [
              { patientName: { contains: search, mode: "insensitive" } },
              { hospitalName: { contains: search, mode: "insensitive" } },
              { address: { contains: search, mode: "insensitive" } },
            ],
          }
        : {},
      // Filters
      blood && blood !== "all" ? { blood } : {},
      division ? { division: division } : {},
      district ? { district: district } : {},
      upazila ? { upazila: upazila } : {},
      requiredDateStart ? { requiredDate: { gte: requiredDateStart } } : {},
      requiredDateEnd ? { requiredDate: { lte: requiredDateEnd } } : {},
      createdAtStart ? { createdAt: { gte: createdAtStart } } : {},
      createdAtEnd ? { createdAt: { lte: createdAtEnd } } : {},
      bloodAmountMin ? { bloodAmount: { gte: bloodAmountMin } } : {},
      bloodAmountMax ? { bloodAmount: { lte: bloodAmountMax } } : {},
      hemoglobinMin ? { hemoglobin: { gte: hemoglobinMin } } : {},
      hemoglobinMax ? { hemoglobin: { lte: hemoglobinMax } } : {},
    ],
  };

  const [bloodRequests, total] = await Promise.all([
    prisma.bloodRequest.findMany({
      where,
      orderBy: [{ requiredDate: "asc" }, { requireTime: "asc" }],
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    }),
    prisma.bloodRequest.count({ where }),
  ]);

  return { bloodRequests, total };
}
 async function getAllMyBloodRequests(
  userId: string,
  params: GetAllBloodRequestsParams
): Promise<{ bloodRequests: BloodRequest[]; total: number }> {
  const {
    page = 1,
    limit = 10,
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
  } = params;
  const userExist = await prisma.user.findUnique({ where: { id: userId } });
  if (!userExist) {
    throw new AppError(404, "User not found!");
  }
  // Get current date and time
  const now = new Date();

  const where: Prisma.BloodRequestWhereInput = {
    userId,
    AND: [

      // Search
      search
        ? {
            OR: [
              { patientName: { contains: search, mode: "insensitive" } },
              { hospitalName: { contains: search, mode: "insensitive" } },
              { address: { contains: search, mode: "insensitive" } },
            ],
          }
        : {},
      // Filters
      blood && blood !== "all" ? { blood } : {},
      division ? { division: division } : {},
      district ? { district: district } : {},
      upazila ? { upazila: upazila } : {},
      requiredDateStart ? { requiredDate: { gte: requiredDateStart } } : {},
      requiredDateEnd ? { requiredDate: { lte: requiredDateEnd } } : {},
      createdAtStart ? { createdAt: { gte: createdAtStart } } : {},
      createdAtEnd ? { createdAt: { lte: createdAtEnd } } : {},
      bloodAmountMin ? { bloodAmount: { gte: bloodAmountMin } } : {},
      bloodAmountMax ? { bloodAmount: { lte: bloodAmountMax } } : {},
      hemoglobinMin ? { hemoglobin: { gte: hemoglobinMin } } : {},
      hemoglobinMax ? { hemoglobin: { lte: hemoglobinMax } } : {},
    ],
  };

  const [bloodRequests, total] = await Promise.all([
    prisma.bloodRequest.findMany({
      where,
      orderBy: [{ requiredDate: "asc" }, { requireTime: "asc" }],
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    }),
    prisma.bloodRequest.count({ where }),
  ]);

  return { bloodRequests, total };
}

const getBloodRequestById = async (
  id: string
): Promise<BloodRequest | null> => {
  if (!ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid blood request ID format");
  }

  const bloodRequest = await prisma.bloodRequest.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });

  if (!bloodRequest) {
    throw new AppError(404, "Blood request not found");
  }

  return bloodRequest;
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
  const { userId, ...dataToUpdate } = payload;

  const updateData: any = { ...dataToUpdate };
  if (userId) {
    updateData.user = { connect: { id: userId } }; // ✅ Correct relation update
  }
  const result = await prisma.bloodRequest.update({
    where: { id },
    data: updateData,
  });
  return result;
};

 const createBloodRequest = async (
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
  getAllMyBloodRequests,
};
