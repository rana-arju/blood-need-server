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
const notificationService = __importStar(require("../notification/notification.service"));
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
const deleteBloodRequest = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma.bloodRequest.delete({
        where: { id },
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
const createBloodRequest = (bloodRequestData) => __awaiter(void 0, void 0, void 0, function* () {
    // Step 1: Create Blood Request
    const request = yield prisma.bloodRequest.create({
        data: bloodRequestData,
    });
    // Step 2: Find Matching Donors (Same Blood Type & District, Exclude Requester)
    const matchingDonors = yield prisma.user.findMany({
        where: {
            blood: bloodRequestData.blood,
            district: bloodRequestData.district,
            id: { not: bloodRequestData.userId },
            //donorInfo: { isNot: null }, // Ensures user is a registered donor
        },
        select: {
            id: true,
        },
    });
    // Step 3: Send Notifications to Matching Donors
    for (const donor of matchingDonors) {
        yield prisma.notification.create({
            data: {
                userId: donor.id,
                title: "Urgent Blood Request",
                body: `A ${bloodRequestData.blood} blood donation is needed at ${bloodRequestData.hospitalName}, ${bloodRequestData.district}.`,
                url: `/requests/${request.id}`,
            },
        });
        yield notificationService.sendNotification(donor.id, "Urgent Blood Request", `A ${bloodRequestData.blood} blood donation is needed at ${bloodRequestData.hospitalName}, ${bloodRequestData.district}.`, `/requests/${request.id}`);
    }
    return request;
});
exports.BloodRequestService = {
    getAllBloodRequests,
    getBloodRequestById,
    createBloodRequest,
    updateBloodRequest,
    deleteBloodRequest,
};
