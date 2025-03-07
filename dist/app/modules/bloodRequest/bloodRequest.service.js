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
exports.getAllBloodRequests = getAllBloodRequests;
const notificationService = __importStar(require("../notification/notification.service"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const bson_1 = require("bson");
async function getAllBloodRequests(params) {
    const { page = 1, limit = 10, search, blood, division, district, upazila, requiredDateStart, requiredDateEnd, createdAtStart, createdAtEnd, bloodAmountMin, bloodAmountMax, hemoglobinMin, hemoglobinMax, } = params;
    // Get current date and time
    const now = new Date();
    const where = {
        AND: [
            // Exclude past requests
            {
                OR: [
                    { requiredDate: { gt: new Date() } },
                    {
                        AND: [
                            { requiredDate: { equals: new Date() } },
                            { requireTime: { gt: new Date() } },
                        ],
                    },
                ],
            },
            // Search
            search
                ? {
                    OR: [
                        { patientName: { contains: search, mode: "insensitive" } },
                        { hospitalName: { contains: search, mode: "insensitive" } },
                        { address: { contains: search, mode: "insensitive" } },
                    ],
                }
                : {},
            // Filters
            blood && blood !== "all" ? { blood } : {},
            division ? { division: division } : {},
            district ? { district: district } : {},
            upazila ? { upazila: upazila } : {},
            requiredDateStart ? { requiredDate: { gte: requiredDateStart } } : {},
            requiredDateEnd ? { requiredDate: { lte: requiredDateEnd } } : {},
            createdAtStart ? { createdAt: { gte: createdAtStart } } : {},
            createdAtEnd ? { createdAt: { lte: createdAtEnd } } : {},
            bloodAmountMin ? { bloodAmount: { gte: bloodAmountMin } } : {},
            bloodAmountMax ? { bloodAmount: { lte: bloodAmountMax } } : {},
            hemoglobinMin ? { hemoglobin: { gte: hemoglobinMin } } : {},
            hemoglobinMax ? { hemoglobin: { lte: hemoglobinMax } } : {},
        ],
    };
    const [bloodRequests, total] = await Promise.all([
        prisma_1.default.bloodRequest.findMany({
            where,
            orderBy: [{ requiredDate: "asc" }, { requireTime: "asc" }],
            skip: (page - 1) * limit,
            take: limit,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
            },
        }),
        prisma_1.default.bloodRequest.count({ where }),
    ]);
    return { bloodRequests, total };
}
const getBloodRequestById = async (id) => {
    if (!bson_1.ObjectId.isValid(id)) {
        throw new AppError_1.default(400, "Invalid blood request ID format");
    }
    const bloodRequest = await prisma_1.default.bloodRequest.findUnique({
        where: { id },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    image: true
                },
            },
        },
    });
    if (!bloodRequest) {
        throw new AppError_1.default(404, "Blood request not found");
    }
    return bloodRequest;
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
