"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DonationController = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const donation_service_1 = require("./donation.service");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const getAllDonationOffers = (0, catchAsync_1.default)(async (req, res) => {
    const { page, limit, status, bloodRequestId, userId } = req.query;
    const params = {
        page: page ? Number.parseInt(page) : undefined,
        limit: limit ? Number.parseInt(limit) : undefined,
        status: status,
        bloodRequestId: bloodRequestId,
        userId: userId,
    };
    const { donationOffers, total } = await donation_service_1.DonationService.getAllDonationOffers(params);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Donation offers retrieved successfully",
        data: donationOffers,
        meta: {
            total,
            page: params.page || 1,
            limit: params.limit || 10,
            // totalPages: Math.ceil(total / (params.limit || 10)),
        },
    });
});
const getMyDonationOffers = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.id;
    const { id } = req.params;
    const result = await donation_service_1.DonationService.getAllMyRequestDonation(userId, id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "My donation offers retrieved successfully",
        data: result,
    });
});
const getSingleDonation = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.id;
    const { id } = req.params;
    const result = await donation_service_1.DonationService.singleDonation(userId, id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "My donation offers retrieved successfully",
        data: result,
    });
});
const getDonationOffersForMyRequests = (0, catchAsync_1.default)(async (req, res) => {
    const { page, limit, status, bloodRequestId } = req.query;
    const userId = req.user?.id;
    // First get all blood requests by this user
    const bloodRequests = await prisma_1.default.bloodRequest.findMany({
        where: { userId },
        select: { id: true },
    });
    const bloodRequestIds = bloodRequests.map((request) => request.id);
    const params = {
        page: page ? Number.parseInt(page) : undefined,
        limit: limit ? Number.parseInt(limit) : undefined,
        status: status,
        bloodRequestId: bloodRequestId,
    };
    // Add filter for blood requests created by this user
    const { donationOffers, total } = await donation_service_1.DonationService.getAllDonationOffers({
        ...params,
        //bloodRequestIds,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Donation offers for my requests retrieved successfully",
        data: donationOffers,
        meta: {
            total,
            page: params.page || 1,
            limit: params.limit || 10,
            //totalPages: Math.ceil(total / (params.limit || 10)),
        },
    });
});
const getDonationOfferById = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.id;
    const result = await donation_service_1.DonationService.getDonationOfferById(id, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Donation offer retrieved successfully",
        data: result,
    });
});
const createDonationOffer = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.id;
    const result = await donation_service_1.DonationService.createDonationOffer(userId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Donation offer created successfully",
        data: result,
    });
});
const updateDonationOfferStatus = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.id;
    const result = await donation_service_1.DonationService.updateDonationOfferStatus(id, userId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Donation offer updated successfully",
        data: result,
    });
});
const deleteDonationOffer = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.id;
    const result = await donation_service_1.DonationService.deleteDonationOffer(id, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Donation offer deleted successfully",
        data: result,
    });
});
// New endpoints to match frontend API calls
const cancelInterest = (0, catchAsync_1.default)(async (req, res) => {
    const { requestId } = req.params;
    const userId = req.user?.id;
    const result = await donation_service_1.DonationService.cancelInterest(requestId, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Interest cancelled successfully",
        data: result,
    });
});
const getInterestedDonorDetails = (0, catchAsync_1.default)(async (req, res) => {
    const { requestId, userId } = req.params;
    const result = await donation_service_1.DonationService.getInterestedDonorDetails(requestId, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Donor details retrieved successfully",
        data: result,
    });
});
const updateDonorStatus = (0, catchAsync_1.default)(async (req, res) => {
    const { requestId, userId } = req.params;
    const { status } = req.body;
    const currentUserId = req.user?.id;
    const result = await donation_service_1.DonationService.updateDonorStatus(requestId, userId, status, currentUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Donor status updated successfully",
        data: result,
    });
});
exports.DonationController = {
    getAllDonationOffers,
    getMyDonationOffers,
    getDonationOffersForMyRequests,
    getDonationOfferById,
    createDonationOffer,
    updateDonationOfferStatus,
    deleteDonationOffer,
    getSingleDonation,
    cancelInterest,
    getInterestedDonorDetails,
    updateDonorStatus,
};
