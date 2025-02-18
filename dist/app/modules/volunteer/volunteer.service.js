"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VolunteerService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
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
const getVolunteerById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma.volunteer.findUnique({
        where: { id },
    });
    return result;
});
const createVolunteer = (volunteerData) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma.volunteer.create({
        data: volunteerData,
    });
    return result;
});
const updateVolunteer = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma.volunteer.update({
        where: { id },
        data: payload,
    });
    return result;
});
const deleteVolunteer = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma.volunteer.delete({
        where: { id },
    });
    return result;
});
exports.VolunteerService = {
    getVolunteerById,
    createVolunteer,
    updateVolunteer,
    deleteVolunteer,
};
