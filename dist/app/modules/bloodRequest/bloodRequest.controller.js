"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BloodRequestController = void 0;
const bloodRequest_service_1 = require("./bloodRequest.service");
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
async function getAllBloodRequests(req, res) {
    try {
        const { page, limit, search, blood, division, district, upazila, requiredDateStart, requiredDateEnd, createdAtStart, createdAtEnd, bloodAmountMin, bloodAmountMax, hemoglobinMin, hemoglobinMax, } = req.query;
        const params = {
            page: page ? Number.parseInt(page) : undefined,
            limit: limit ? Number.parseInt(limit) : undefined,
            search: search,
            blood: blood,
            division: division,
            district: district,
            upazila: upazila,
            requiredDateStart: requiredDateStart
                ? new Date(requiredDateStart)
                : undefined,
            requiredDateEnd: requiredDateEnd
                ? new Date(requiredDateEnd)
                : undefined,
            createdAtStart: createdAtStart
                ? new Date(createdAtStart)
                : undefined,
            createdAtEnd: createdAtEnd ? new Date(createdAtEnd) : undefined,
            bloodAmountMin: bloodAmountMin
                ? Number.parseInt(bloodAmountMin)
                : undefined,
            bloodAmountMax: bloodAmountMax
                ? Number.parseInt(bloodAmountMax)
                : undefined,
            hemoglobinMin: hemoglobinMin
                ? Number.parseInt(hemoglobinMin)
                : undefined,
            hemoglobinMax: hemoglobinMax
                ? Number.parseInt(hemoglobinMax)
                : undefined,
        };
        const { bloodRequests, total } = await bloodRequest_service_1.BloodRequestService.getAllBloodRequests(params);
        res.json({
            success: true,
            data: bloodRequests,
            meta: {
                total,
                page: params.page || 1,
                limit: params.limit || 10,
                totalPages: Math.ceil(total / (params.limit || 10)),
            },
        });
    }
    catch (error) {
        console.error("Error in getAllBloodRequests:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}
async function getAllMyBloodRequests(req, res) {
    try {
        const { page, limit, search, blood, division, district, upazila, requiredDateStart, requiredDateEnd, createdAtStart, createdAtEnd, bloodAmountMin, bloodAmountMax, hemoglobinMin, hemoglobinMax, } = req.query;
        const userId = req.user?.id;
        const params = {
            page: page ? Number.parseInt(page) : undefined,
            limit: limit ? Number.parseInt(limit) : undefined,
            search: search,
            blood: blood,
            division: division,
            district: district,
            upazila: upazila,
            requiredDateStart: requiredDateStart
                ? new Date(requiredDateStart)
                : undefined,
            requiredDateEnd: requiredDateEnd
                ? new Date(requiredDateEnd)
                : undefined,
            createdAtStart: createdAtStart
                ? new Date(createdAtStart)
                : undefined,
            createdAtEnd: createdAtEnd ? new Date(createdAtEnd) : undefined,
            bloodAmountMin: bloodAmountMin
                ? Number.parseInt(bloodAmountMin)
                : undefined,
            bloodAmountMax: bloodAmountMax
                ? Number.parseInt(bloodAmountMax)
                : undefined,
            hemoglobinMin: hemoglobinMin
                ? Number.parseInt(hemoglobinMin)
                : undefined,
            hemoglobinMax: hemoglobinMax
                ? Number.parseInt(hemoglobinMax)
                : undefined,
        };
        const { bloodRequests, total } = await bloodRequest_service_1.BloodRequestService.getAllMyBloodRequests(userId, params);
        res.json({
            success: true,
            data: bloodRequests,
            meta: {
                total,
                page: params.page || 1,
                limit: params.limit || 10,
                totalPages: Math.ceil(total / (params.limit || 10)),
            },
        });
    }
    catch (error) {
        console.error("Error in getAllBloodRequests:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}
const getBloodRequestById = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await bloodRequest_service_1.BloodRequestService.getBloodRequestById(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Blood request retrieved successfully",
        data: result,
    });
});
const createBloodRequest = (0, catchAsync_1.default)(async (req, res) => {
    const result = await bloodRequest_service_1.BloodRequestService.createBloodRequest(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Blood request created successfully",
        data: result,
    });
});
const updateBloodRequest = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.id;
    const result = await bloodRequest_service_1.BloodRequestService.updateBloodRequest(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Blood request updated successfully",
        data: result,
    });
});
const deleteBloodRequest = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.id;
    const result = await bloodRequest_service_1.BloodRequestService.deleteBloodRequest(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Blood request deleted successfully",
        data: result,
    });
});
exports.BloodRequestController = {
    getAllBloodRequests,
    getBloodRequestById,
    createBloodRequest,
    updateBloodRequest,
    deleteBloodRequest,
    getAllMyBloodRequests,
};
