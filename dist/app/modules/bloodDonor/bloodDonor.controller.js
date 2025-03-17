"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BloodDonorController = void 0;
const bloodDonor_service_1 = require("./bloodDonor.service");
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const pick_1 = __importDefault(require("../../shared/pick"));
const bloodDonor_constant_1 = require("./bloodDonor.constant");
const pagination_1 = require("../../constants/pagination");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const getAllBloodDonors = (0, catchAsync_1.default)(async (req, res) => {
    const filters = (0, pick_1.default)(req.query, bloodDonor_constant_1.bloodDonorFilterableFields);
    const paginationOptions = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = await bloodDonor_service_1.BloodDonorService.getAllBloodDonors(filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Blood donors retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});
const getBloodDonorById = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await bloodDonor_service_1.BloodDonorService.getBloodDonorById(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Blood donor retrieved successfully",
        data: result,
    });
});
const getBloodDonorUserId = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await bloodDonor_service_1.BloodDonorService.getBloodDonorByUserId(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Blood donor retrieved successfully",
        data: result,
    });
});
const createBloodDonor = (0, catchAsync_1.default)(async (req, res) => {
    const result = await bloodDonor_service_1.BloodDonorService.createBloodDonor(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Blood donor created successfully",
        data: result,
    });
});
const updateBloodDonor = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await bloodDonor_service_1.BloodDonorService.updateBloodDonor(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Blood donor updated successfully",
        data: result,
    });
});
const deleteBloodDonor = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await bloodDonor_service_1.BloodDonorService.deleteBloodDonor(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Blood donor deleted successfully",
        data: result,
    });
});
// Get top donors based on donation count
const getTopDonors = async (req, res) => {
    try {
        const limit = Number.parseInt(req.query.limit) || 6;
        // Get users with donation counts
        const usersWithDonations = await prisma_1.default.user.findMany({
            select: {
                id: true,
                name: true,
                blood: true,
                image: true,
                createdAt: true,
                donations: {
                    where: {
                        status: "confirmed",
                    },
                },
            },
            orderBy: [
                {
                    donations: {
                        _count: "desc",
                    },
                },
                {
                    createdAt: "asc", // Secondary sort by creation date (for new users)
                },
            ],
            take: limit,
        });
        // Map and transform the data
        const donors = usersWithDonations.map((user, index) => {
            const donationCount = user.donations.length;
            return {
                id: user.id,
                name: user.name,
                donations: donationCount,
                blood: user.blood || "Unknown",
                image: user.image,
                rank: index + 1,
                createdAt: user.createdAt,
            };
        });
        // If all users have 0 donations, get newest users instead
        if (donors.length > 0 && donors.every((donor) => donor.donations === 0)) {
            const newUsers = await prisma_1.default.user.findMany({
                select: {
                    id: true,
                    name: true,
                    blood: true,
                    image: true,
                    createdAt: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
                take: limit,
            });
            const newDonors = newUsers.map((user, index) => ({
                id: user.id,
                name: user.name,
                donations: 0,
                blood: user.blood || "Unknown",
                image: user.image,
                rank: index + 1,
                createdAt: user.createdAt,
            }));
            return res.status(200).json({ donors: newDonors });
        }
        return res.status(200).json({ donors });
    }
    catch (error) {
        console.error("Error fetching top donors:", error);
        return res.status(500).json({
            message: "Failed to fetch top donors",
        });
    }
};
exports.BloodDonorController = {
    getAllBloodDonors,
    getBloodDonorById,
    createBloodDonor,
    updateBloodDonor,
    deleteBloodDonor,
    getBloodDonorUserId,
    getTopDonors,
};
