import { PrismaClient, type User } from "@prisma/client";
import type { IUser, IUserFilters } from "./user.interface";
import { paginationHelpers } from "../../helpers/paginationHelper";
import type { IPaginationOptions } from "../../interfaces/pagination";
import AppError from "../../error/AppError";

const prisma = new PrismaClient();

const getAllUsers = async (
  filters: IUserFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<User[]>> => {
  const { searchTerm, bloodType } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: ["name", "email"].map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (bloodType) {
    andConditions.push({
      bloodType: {
        equals: bloodType,
      },
    });
  }

  const whereConditions =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.user.count({ where: whereConditions });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const createUser = async (userData: IUser): Promise<User> => {
  const userExist = await prisma.user.findUnique({
    where: {
      email: userData.email,
    },
  });
  if (userExist) {
    throw new AppError(401, "User already exist!");
  }
  const result = await prisma.user.create({
    data: userData,
  });
  return result;
};

const updateUser = async (
  id: string,
  payload: Partial<IUser>
): Promise<User> => {
  const result = await prisma.user.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteUser = async (id: string): Promise<User> => {
  const result = await prisma.user.delete({
    where: {
      id,
    },
  });
  return result;
};

export const UserService = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
};
