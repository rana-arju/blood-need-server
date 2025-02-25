"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BloodRequestController = void 0;
const bloodRequest_service_1 = require("./bloodRequest.service");
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const pick_1 = __importDefault(require("../../shared/pick"));
const bloodRequest_constant_1 = require("./bloodRequest.constant");
const pagination_1 = require("../../constants/pagination");
const getAllBloodRequests = (0, catchAsync_1.default)(async (req, res) => {
    const filters = (0, pick_1.default)(req.query, bloodRequest_constant_1.bloodRequestFilterableFields);
    const paginationOptions = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = await bloodRequest_service_1.BloodRequestService.getAllBloodRequests(filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Blood requests retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});
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
};
