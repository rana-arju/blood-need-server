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
exports.DonationService = void 0;
const client_1 = require("@prisma/client");
const paginationHelper_1 = require("../../helpers/paginationHelper");
const prisma = new client_1.PrismaClient();
const getAllDonations = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
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
    const result = yield prisma.donation.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
    });
    const total = yield prisma.donation.count({ where: whereConditions });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const createDonation = (donationData) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma.donation.create({
        data: donationData,
    });
    return result;
});
const updateDonation = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma.donation.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
});
const deleteDonation = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma.donation.delete({
        where: {
            id,
        },
    });
    return result;
});
exports.DonationService = {
    getAllDonations,
    createDonation,
    updateDonation,
    deleteDonation,
};
