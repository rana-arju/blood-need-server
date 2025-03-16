import { PrismaClient, type User } from "@prisma/client";
import type { IUser, IUserFilters } from "./user.interface";
import { paginationHelpers } from "../../helpers/paginationHelper";
import AppError from "../../error/AppError";
import bcrypt from "bcrypt";
import { IPaginationOptions } from "../../interface/pagination";
import { IGenericResponse } from "../../interface/common";
import prisma from "../../shared/prisma";
import { ObjectId } from "bson";
import { AchievementService } from "../achievement/achievement.service";

const randomPass = Math.random().toString(36).slice(2, 12);

const getAllUsers = async (
  filters: IUserFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<User[]>> => {
  const { searchTerm, blood } = filters;
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

  if (blood) {
    andConditions.push({
      blood: {
        equals: blood,
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

const createUser = async (payload: IUser): Promise<User> => {
  const password = payload?.password || randomPass;

  const userExist = await prisma.user.findUnique({
    where: {
      email: payload?.email,
    },
  });
  if (userExist) {
    if (
      (userExist?.provider && userExist?.provider == "google") ||
      userExist?.provider == "facebook"
    ) {
      return userExist;
    }
    throw new AppError(401, "User already exist!");
  }
  // 🔹 Hash the password before storing it
  const hashedPassword = await bcrypt.hash(password, 10); // 10 = salt rounds
  payload.password = hashedPassword;
  const result = await prisma.$transaction(async (tx) => {
    // Create the user
    const newUser = await tx.user.create({
      data: payload,
    });

    // Initialize achievements for the new user
    await AchievementService.initializeUserAchievements(newUser.id);

    return newUser;
  });

  return result;
};

const loginUser = async (payload: Partial<IUser>) => {
  const password = payload?.password;

  const userExist = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });
  if (!userExist) {
    throw new AppError(401, "User does not exist!");
  }
  // 🔹 Compare the password
  const isMatch = await bcrypt.compare(
    password as string,
    userExist.password as string
  );

  if (!isMatch) throw new AppError(401, "Invalid email or password");
  return userExist;
};

const updateUser = async (
  id: string,
  payload: Partial<User>
): Promise<User> => {
  const userExist = await prisma.user.findUnique({
    where: { id },
  });

  if (!userExist) {
    throw new AppError(404, "This user not found!");
  }

  const cleanPayload = Object.fromEntries(
    Object.entries(payload).filter(([_, v]) => v !== undefined)
  );

  const result = await prisma.user.update({
    where: { id },
    data: { ...cleanPayload, profileUpdate: true },
  });

  return result;
};
const updatePassword = async (id: string, payload: string) => {
  const userExist = await prisma.user.findUnique({
    where: { id },
  });

  if (!userExist) {
    throw new AppError(404, "This user not found!");
  }
  if (userExist.status == "blocked") {
    throw new AppError(401, "You are blocked. You can't password update!");
  }
  const hashedPassword = await bcrypt.hash(payload, 10); // 10 = salt rounds

  const result = await prisma.user.update({
    where: { id },
    data: { password: hashedPassword },
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
const getMeUser = async (id: string): Promise<User> => {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};
const getUser = async (id: string): Promise<User> => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      donorInfo: {
        select: {
          phone: true,
          whatsappNumber: true,
          facebookId: true,
          emergencyContact: true,
          height: true,
          weight: true,
          medicalCondition: true,
          currentMedications: true,
        },
      },
    },
  });
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};
const updateDonationCount = async (userId: string): Promise<void> => {
  if (!ObjectId.isValid(userId)) {
    throw new AppError(400, "Invalid user ID format");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  // Count completed donations
  const completedDonationsCount = await prisma.donation.count({
    where: {
      userId,
      status: "completed",
    },
  });

  // Update user's donation count
  await prisma.user.update({
    where: { id: userId },
    data: {
      donationCount: completedDonationsCount,
      lastDonationDate: new Date(),
    },
  });

  // Check and update achievements
  await AchievementService.checkAndUpdateAchievements(userId);
};
export const UserService = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  getMeUser,
  getUser,
  updateDonationCount,
  updatePassword,
};
