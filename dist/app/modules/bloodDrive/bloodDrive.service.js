"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BloodDriveService = void 0;
const paginationHelper_1 = require("../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const getAllBloodDrives = async (filters, paginationOptions) => {
    const { searchTerm, organizer, startDate, endDate } = filters;
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
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
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = await prisma_1.default.bloodDrive.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
    });
    const total = await prisma_1.default.bloodDrive.count({ where: whereConditions });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
};
const getBloodDriveById = async (id) => {
    const result = await prisma_1.default.bloodDrive.findUnique({
        where: { id },
    });
    return result;
};
const createBloodDrive = async (bloodDriveData) => {
    const result = await prisma_1.default.bloodDrive.create({
        data: {
            ...bloodDriveData,
            user: {
                connect: { id: bloodDriveData.user.connect.id },
            },
        },
    });
    return result;
};
const updateBloodDrive = async (id, payload) => {
    const { userId, ...updateData } = payload;
    const result = await prisma_1.default.bloodDrive.update({
        where: { id },
        data: updateData,
    });
    return result;
};
const deleteBloodDrive = async (id) => {
    const result = await prisma_1.default.bloodDrive.delete({
        where: { id },
    });
    return result;
};
exports.BloodDriveService = {
    getAllBloodDrives,
    getBloodDriveById,
    createBloodDrive,
    updateBloodDrive,
    deleteBloodDrive,
};
