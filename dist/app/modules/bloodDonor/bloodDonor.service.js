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
    const { searchTerm, eligibleToDonateSince, blood, division, district, upazila, gender, lastDonationDate, } = filters;
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    // Build the where condition for Prisma
    const whereConditions = {};
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
    if (blood ||
        division ||
        district ||
        upazila ||
        gender ||
        lastDonationDate ||
        eligibleToDonateSince) {
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
                    dateOfBirth: true
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
                    image: true, // Select user image
                    district: true, // Select user district
                    division: true, // Select user division
                    upazila: true, // Select user upazila
                    blood: true, // Select user blood
                    gender: true, // Select user gender
                    lastDonationDate: true, // Select user last donation
                    dateOfBirth: true,
                    address: true
                },
            },
        },
    });
    return result;
};
const getBloodDonorByUserId = async (id) => {
    if (!bson_1.ObjectId.isValid(id)) {
        throw new AppError_1.default(400, "Invalid blood donor ID format");
    }
    const isExist = await prisma_1.default.bloodDonor.findUnique({ where: { userId: id } });
    if (!isExist) {
        throw new AppError_1.default(404, "Blood donor not found");
    }
    const result = await prisma_1.default.bloodDonor.findUnique({
        where: { userId: id },
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
                    dateOfBirth: true,
                    address: true,
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
    const { userId, ...dataToUpdate } = payload;
    const isExist = await prisma_1.default.bloodDonor.findUnique({ where: { id } });
    if (!isExist) {
        throw new AppError_1.default(404, "Blood donor not found");
    }
    const result = await prisma_1.default.bloodDonor.update({
        where: { id },
        data: {
            ...dataToUpdate,
            user: userId ? { connect: { id: userId } } : undefined,
        }
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
    getBloodDonorByUserId,
};
