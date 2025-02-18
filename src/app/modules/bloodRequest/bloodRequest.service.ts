import { PrismaClient, type BloodRequest } from "@prisma/client";
import type {
  IBloodRequest,
  IBloodRequestFilters,
} from "./bloodRequest.interface";
import { paginationHelpers } from "../../helpers/paginationHelper";
import { IPaginationOptions } from "../../interface/pagination";
import { IGenericResponse } from "../../interface/common";
import * as notificationService from "../notification/notification.service";
const prisma = new PrismaClient();

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
  const result = await prisma.bloodRequest.findUnique({
    where: { id },
  });
  return result;
};
const deleteBloodRequest = async (id: string): Promise<BloodRequest> => {
  const result = await prisma.bloodRequest.delete({
    where: { id },
  });
  return result;
};
const updateBloodRequest = async (
  id: string,
  payload: Partial<IBloodRequest>
): Promise<BloodRequest> => {
  const result = await prisma.bloodRequest.update({
    where: { id },
    data: payload,
  });
  return result;
};

const createBloodRequest = async (bloodRequestData: IBloodRequest) => {
  // Step 1: Create Blood Request
  const request = await prisma.bloodRequest.create({
    data: bloodRequestData,
  });

  // Step 2: Find Matching Donors (Same Blood Type & District, Exclude Requester)
  const matchingDonors = await prisma.user.findMany({
    where: {
      blood: bloodRequestData.blood,
      district: bloodRequestData.district,
      id: { not: bloodRequestData.userId },
      donorInfo: { isNot: null }, // Ensures user is a registered donor
    },
    select: {
      id: true,
    },
  });

  // Step 3: Send Notifications to Matching Donors
  for (const donor of matchingDonors) {
    await prisma.notification.create({
      data: {
        userId: donor.id,
        title: "Urgent Blood Request",
        body: `A ${bloodRequestData.blood} blood donation is needed at ${bloodRequestData.hospitalName}, ${bloodRequestData.district}.`,
        url: `/blood-requests/${request.id}`,
      },
    });

    await notificationService.sendNotification(
      donor.id,
      "Urgent Blood Request",
      `A ${bloodRequestData.blood} blood donation is needed at ${bloodRequestData.hospitalName}, ${bloodRequestData.district}.`,
      `/requests/${request.id}`
    );
  }

  return request;
};

export const BloodRequestService = {
  getAllBloodRequests,
  getBloodRequestById,
  createBloodRequest,
  updateBloodRequest,
  deleteBloodRequest,
};
