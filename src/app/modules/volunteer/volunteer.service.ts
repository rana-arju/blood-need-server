import { PrismaClient, type Volunteer } from "@prisma/client";
import type { IVolunteer, IVolunteerFilters } from "./volunteer.interface";
import { paginationHelpers } from "../../helpers/paginationHelper";
import { IPaginationOptions } from "../../interface/pagination";
import { IGenericResponse } from "../../interface/common";
import prisma from "../../shared/prisma";

/*
const getAllVolunteers = async (
  filters: IVolunteerFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Volunteer[]>> => {
  const { searchTerm, skills, availability } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: ["userId", "experience"].map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (skills && skills.length > 0) {
    andConditions.push({
      skills: {
        hasSome: skills,
      },
    });
  }

  if (availability) {
    andConditions.push({
      availability: {
        equals: availability,
      },
    });
  }

  const whereConditions =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.volunteer.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.volunteer.count({ where: whereConditions });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};
*/
const getVolunteerById = async (id: string): Promise<Volunteer | null> => {
  const result = await prisma.volunteer.findUnique({
    where: { id },
  });
  return result;
};

const createVolunteer = async (
  volunteerData: IVolunteer
): Promise<Volunteer> => {
  const result = await prisma.volunteer.create({
    data: volunteerData,
  });
  return result;
};

const updateVolunteer = async (
  id: string,
  payload: Partial<IVolunteer>
): Promise<Volunteer> => {
  const result = await prisma.volunteer.update({
    where: { id },
    data: payload,
  });
  return result;
};

const deleteVolunteer = async (id: string): Promise<Volunteer> => {
  const result = await prisma.volunteer.delete({
    where: { id },
  });
  return result;
};

export const VolunteerService = {
  getVolunteerById,
  createVolunteer,
  updateVolunteer,
  deleteVolunteer,
};
