"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BloodRequestService = exports.createBloodRequest = void 0;
const paginationHelper_1 = require("../../helpers/paginationHelper");
const notificationService = __importStar(require("../notification/notification.service"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const bson_1 = require("bson");
const getAllBloodRequests = async (filters, paginationOptions) => {
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
    const result = await prisma_1.default.bloodRequest.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
    });
    const total = await prisma_1.default.bloodRequest.count({ where: whereConditions });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
};
const getBloodRequestById = async (id) => {
    if (!bson_1.ObjectId.isValid(id)) {
        throw new AppError_1.default(400, "Invalid blood request ID format");
    }
    const isExist = await prisma_1.default.bloodRequest.findUnique({ where: { id } });
    if (!isExist) {
        throw new AppError_1.default(404, "Blood request not found");
    }
    const result = await prisma_1.default.bloodRequest.findUnique({
        where: { id },
    });
    return result;
};
const deleteBloodRequest = async (id) => {
    if (!bson_1.ObjectId.isValid(id)) {
        throw new AppError_1.default(400, "Invalid blood request ID format");
    }
    const isExist = await prisma_1.default.bloodRequest.findUnique({ where: { id } });
    if (!isExist) {
        throw new AppError_1.default(404, "Blood request not found");
    }
    const result = await prisma_1.default.bloodRequest.delete({
        where: { id },
    });
    return result;
};
const updateBloodRequest = async (id, payload) => {
    if (!bson_1.ObjectId.isValid(id)) {
        throw new AppError_1.default(400, "Invalid blood request ID format");
    }
    const isExist = await prisma_1.default.bloodRequest.findUnique({ where: { id } });
    if (!isExist) {
        throw new AppError_1.default(404, "Blood request not found");
    }
    const result = await prisma_1.default.bloodRequest.update({
        where: { id },
        data: payload,
    });
    return result;
};
const createBloodRequest = async (bloodRequestData) => {
    const result = await prisma_1.default.bloodRequest.create({
        data: bloodRequestData,
    });
    // Send notifications to matching donors
    await notificationService.sendNotificationToMatchingDonors(result);
    return result;
};
exports.createBloodRequest = createBloodRequest;
exports.BloodRequestService = {
    getAllBloodRequests,
    getBloodRequestById,
    createBloodRequest: exports.createBloodRequest,
    updateBloodRequest,
    deleteBloodRequest,
};
