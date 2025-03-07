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
  const {
    searchTerm,
    eligibleToDonateSince,
    blood,
    division,
    district,
    upazila,
    gender,
    lastDonationDate,
  } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  // Build the where condition for Prisma
  const whereConditions: any = {};

  // Search term handling
  if (searchTerm) {
    whereConditions.OR = [
      {
        phone: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
      {
        user: {
          name: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
      },
      {
        user: {
          email: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
      },
    ];
  }

  // User relation filters
  if (
    blood ||
    division ||
    district ||
    upazila ||
    gender ||
    lastDonationDate ||
    eligibleToDonateSince
  ) {
    whereConditions.user = {};

    if (blood) {
      whereConditions.user.blood = blood;
    }

    if (division) {
      whereConditions.user.division = division;
    }

    if (district) {
      whereConditions.user.district = district;
    }

    if (upazila) {
      whereConditions.user.upazila = upazila;
    }

    if (gender && gender !== "all") {
      whereConditions.user.gender = gender;
    }

    if (lastDonationDate) {
      whereConditions.user.lastDonationDate = {
        lte: new Date(lastDonationDate),
      };
    }

    if (eligibleToDonateSince) {
      whereConditions.user.lastDonationDate = {
        ...(whereConditions.user.lastDonationDate || {}),
        lte: new Date(eligibleToDonateSince),
      };
    }
  }

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
          id: true,
          name: true,
          email: true,
          image: true,
          district: true,
          division: true,
          upazila: true,
          blood: true,
          gender: true,
          lastDonationDate: true,
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
          image: true, // Select user image
          district: true, // Select user district
          division: true, // Select user division
          upazila: true, // Select user upazila
          blood: true, // Select user blood
          gender: true, // Select user gender
          lastDonationDate: true, // Select user last donation
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
