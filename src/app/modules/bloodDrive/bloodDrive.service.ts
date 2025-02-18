import { PrismaClient, type BloodDrive } from "@prisma/client";
import type { IBloodDrive, IBloodDriveFilters } from "./bloodDrive.interface";
import { paginationHelpers } from "../../helpers/paginationHelper";
import { IPaginationOptions } from "../../interface/pagination";
import { IGenericResponse } from "../../interface/common";


const prisma = new PrismaClient();

const getAllBloodDrives = async (
  filters: IBloodDriveFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<BloodDrive[]>> => {
  const { searchTerm, organizer, startDate, endDate } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: ["name", "location", "description"].map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (organizer) {
    andConditions.push({ organizer });
  }

  if (startDate && endDate) {
    andConditions.push({
      date: {
        gte: startDate,
        lte: endDate,
      },
    });
  }

  const whereConditions =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.bloodDrive.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.bloodDrive.count({ where: whereConditions });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getBloodDriveById = async (id: string): Promise<BloodDrive | null> => {
  const result = await prisma.bloodDrive.findUnique({
    where: { id },
  });
  return result;
};

const createBloodDrive = async (
  bloodDriveData: Omit<IBloodDrive, "userId"> & {
    user: { connect: { id: string } };
  }
): Promise<BloodDrive> => {
  const result = await prisma.bloodDrive.create({
    data: {
      ...bloodDriveData,
      user: {
        connect: { id: bloodDriveData.user.connect.id },
      },
    },
  });
  return result;
};


const updateBloodDrive = async (
  id: string,
  payload: Partial<IBloodDrive>
): Promise<BloodDrive> => {
  const { userId, ...updateData } = payload;
  const result = await prisma.bloodDrive.update({
    where: { id },
    data: updateData,
  });
  return result;
};

const deleteBloodDrive = async (id: string): Promise<BloodDrive> => {
  const result = await prisma.bloodDrive.delete({
    where: { id },
  });
  return result;
};

export const BloodDriveService = {
  getAllBloodDrives,
  getBloodDriveById,
  createBloodDrive,
  updateBloodDrive,
  deleteBloodDrive,
};
