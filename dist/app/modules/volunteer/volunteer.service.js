"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VolunteerService = void 0;
const prisma_1 = __importDefault(require("../../shared/prisma"));
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
const getVolunteerById = async (id) => {
    const result = await prisma_1.default.volunteer.findUnique({
        where: { id },
    });
    return result;
};
const createVolunteer = async (volunteerData) => {
    const result = await prisma_1.default.volunteer.create({
        data: volunteerData,
    });
    return result;
};
const updateVolunteer = async (id, payload) => {
    const result = await prisma_1.default.volunteer.update({
        where: { id },
        data: payload,
    });
    return result;
};
const deleteVolunteer = async (id) => {
    const result = await prisma_1.default.volunteer.delete({
        where: { id },
    });
    return result;
};
exports.VolunteerService = {
    getVolunteerById,
    createVolunteer,
    updateVolunteer,
    deleteVolunteer,
};
