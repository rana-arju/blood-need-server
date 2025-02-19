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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BloodDonorService = void 0;
const paginationHelper_1 = require("../../helpers/paginationHelper");
const AppError_1 = __importDefault(require("../../error/AppError"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const getAllBloodDonors = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
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
    const result = yield prisma_1.default.bloodDonor.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
    });
    const total = yield prisma_1.default.bloodDonor.count({ where: whereConditions });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getBloodDonorById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.bloodDonor.findUnique({
        where: { id },
    });
    return result;
});
const createBloodDonor = (bloodDonorData) => __awaiter(void 0, void 0, void 0, function* () {
    const donorExist = yield prisma_1.default.bloodDonor.findUnique({
        where: { userId: bloodDonorData === null || bloodDonorData === void 0 ? void 0 : bloodDonorData.userId },
    });
    if (donorExist) {
        throw new AppError_1.default(400, "You already register!");
    }
    const result = yield prisma_1.default.bloodDonor.create({
        data: bloodDonorData,
    });
    return result;
});
const updateBloodDonor = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.bloodDonor.update({
        where: { id },
        data: payload,
    });
    return result;
});
const deleteBloodDonor = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.bloodDonor.delete({
        where: { id },
    });
    return result;
});
exports.BloodDonorService = {
    getAllBloodDonors,
    getBloodDonorById,
    createBloodDonor,
    updateBloodDonor,
    deleteBloodDonor,
};
