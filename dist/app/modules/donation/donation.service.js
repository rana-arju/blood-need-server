"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DonationService = void 0;
const paginationHelper_1 = require("../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const getAllDonations = async (filters, paginationOptions) => {
    const { searchTerm, userId, startDate, endDate } = filters;
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: ["location"].map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    if (userId) {
        andConditions.push({ userId: userId });
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
    const result = await prisma_1.default.donation.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
    });
    const total = await prisma_1.default.donation.count({ where: whereConditions });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
};
const createDonation = async (donationData) => {
    const result = await prisma_1.default.donation.create({
        data: donationData,
    });
    return result;
};
const updateDonation = async (id, payload) => {
    const result = await prisma_1.default.donation.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
};
const deleteDonation = async (id) => {
    const result = await prisma_1.default.donation.delete({
        where: {
            id,
        },
    });
    return result;
};
exports.DonationService = {
    getAllDonations,
    createDonation,
    updateDonation,
    deleteDonation,
};
