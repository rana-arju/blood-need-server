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
exports.BloodRequestService = void 0;
const client_1 = require("@prisma/client");
const paginationHelper_1 = require("../../helpers/paginationHelper");
const prisma = new client_1.PrismaClient();
const getAllBloodRequests = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, bloodType, urgency, status } = filters;
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
    if (bloodType) {
        andConditions.push({ bloodType });
    }
    if (urgency) {
        andConditions.push({ urgency });
    }
    if (status) {
        andConditions.push({ status });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma.bloodRequest.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
    });
    const total = yield prisma.bloodRequest.count({ where: whereConditions });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getBloodRequestById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma.bloodRequest.findUnique({
        where: { id },
    });
    return result;
});
const createBloodRequest = (bloodRequestData) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma.bloodRequest.create({
        data: bloodRequestData,
    });
    return result;
});
const updateBloodRequest = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma.bloodRequest.update({
        where: { id },
        data: payload,
    });
    return result;
});
const deleteBloodRequest = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma.bloodRequest.delete({
        where: { id },
    });
    return result;
});
exports.BloodRequestService = {
    getAllBloodRequests,
    getBloodRequestById,
    createBloodRequest,
    updateBloodRequest,
    deleteBloodRequest,
};
