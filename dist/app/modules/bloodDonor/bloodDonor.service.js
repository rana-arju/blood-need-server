"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BloodDonorService = void 0;
const paginationHelper_1 = require("../../helpers/paginationHelper");
const AppError_1 = __importDefault(require("../../error/AppError"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const bson_1 = require("bson");
const getAllBloodDonors = async (filters, paginationOptions) => {
    const { searchTerm, eligibleToDonateSince } = filters;
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
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
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = await prisma_1.default.bloodDonor.findMany({
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
    const total = await prisma_1.default.bloodDonor.count({ where: whereConditions });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
};
const getBloodDonorById = async (id) => {
    if (!bson_1.ObjectId.isValid(id)) {
        throw new AppError_1.default(400, "Invalid blood donor ID format");
    }
    const isExist = await prisma_1.default.bloodDonor.findUnique({ where: { id } });
    if (!isExist) {
        throw new AppError_1.default(404, "Blood donor not found");
    }
    const result = await prisma_1.default.bloodDonor.findUnique({
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
const createBloodDonor = async (bloodDonorData) => {
    const donorExist = await prisma_1.default.bloodDonor.findUnique({
        where: { userId: bloodDonorData?.userId },
    });
    if (donorExist) {
        throw new AppError_1.default(400, "You already register!");
    }
    const result = await prisma_1.default.bloodDonor.create({
        data: bloodDonorData,
    });
    return result;
};
const updateBloodDonor = async (id, payload) => {
    if (!bson_1.ObjectId.isValid(id)) {
        throw new AppError_1.default(400, "Invalid blood donor ID format");
    }
    const isExist = await prisma_1.default.bloodDonor.findUnique({ where: { id } });
    if (!isExist) {
        throw new AppError_1.default(404, "Blood donor not found");
    }
    const result = await prisma_1.default.bloodDonor.update({
        where: { id },
        data: payload,
    });
    return result;
};
const deleteBloodDonor = async (id) => {
    if (!bson_1.ObjectId.isValid(id)) {
        throw new AppError_1.default(400, "Invalid blood donor ID format");
    }
    const isExist = await prisma_1.default.bloodDonor.findUnique({ where: { id } });
    if (!isExist) {
        throw new AppError_1.default(404, "Blood donor not found");
    }
    const result = await prisma_1.default.bloodDonor.delete({
        where: { id },
    });
    return result;
};
exports.BloodDonorService = {
    getAllBloodDonors,
    getBloodDonorById,
    createBloodDonor,
    updateBloodDonor,
    deleteBloodDonor,
};
