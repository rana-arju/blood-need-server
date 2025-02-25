import { PrismaClient, type BloodDonor } from "@prisma/client";
import type { IBloodDonor, IBloodDonorFilters } from "./bloodDonor.interface";
import { paginationHelpers } from "../../helpers/paginationHelper";
import { IPaginationOptions } from "../../interface/pagination";
import { IGenericResponse } from "../../interface/common";
import AppError from "../../error/AppError";
import prisma from "../../shared/prisma";
import { ObjectId } from "bson";

const getAllBloodDonors = async (
  filters: IBloodDonorFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<BloodDonor[]>> => {
  const { searchTerm, eligibleToDonateSince } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: ["userId"].map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (eligibleToDonateSince) {
    andConditions.push({
      eligibleToDonateSince: {
        lte: eligibleToDonateSince,
      },
    });
  }

  const whereConditions =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.bloodDonor.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      user: {
        select: {
          id: true, // Select user ID
          name: true, // Select user name
          email: true, // Select user email
          blood: true, // Select user email
          gender: true, // Select user email
          lastDonationDate: true, // Select user email
        },
      },
    },
  });

  const total = await prisma.bloodDonor.count({ where: whereConditions });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getBloodDonorById = async (id: string): Promise<BloodDonor | null> => {
  if (!ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid blood donor ID format");
  }
  const isExist = await prisma.bloodDonor.findUnique({ where: { id } });

  if (!isExist) {
    throw new AppError(404, "Blood donor not found");
  }
  const result = await prisma.bloodDonor.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true, // Select user ID
          name: true, // Select user name
          email: true, // Select user email
          blood: true, // Select user email
          gender: true, // Select user email
          lastDonationDate: true, // Select user email
        },
      },
    },
  });
  return result;
};

const createBloodDonor = async (
  bloodDonorData: IBloodDonor
): Promise<BloodDonor> => {
  const donorExist = await prisma.bloodDonor.findUnique({
    where: { userId: bloodDonorData?.userId },
  });
  if (donorExist) {
    throw new AppError(400, "You already register!");
  }
  const result = await prisma.bloodDonor.create({
    data: bloodDonorData,
  });
  return result;
};

const updateBloodDonor = async (
  id: string,
  payload: Partial<IBloodDonor>
): Promise<BloodDonor> => {
  if (!ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid blood donor ID format");
  }
  const isExist = await prisma.bloodDonor.findUnique({ where: { id } });

  if (!isExist) {
    throw new AppError(404, "Blood donor not found");
  }
  const result = await prisma.bloodDonor.update({
    where: { id },
    data: payload,
  });
  return result;
};

const deleteBloodDonor = async (id: string): Promise<BloodDonor> => {
  if (!ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid blood donor ID format");
  }
  const isExist = await prisma.bloodDonor.findUnique({ where: { id } });

  if (!isExist) {
    throw new AppError(404, "Blood donor not found");
  }
  const result = await prisma.bloodDonor.delete({
    where: { id },
  });
  return result;
};

export const BloodDonorService = {
  getAllBloodDonors,
  getBloodDonorById,
  createBloodDonor,
  updateBloodDonor,
  deleteBloodDonor,
};
