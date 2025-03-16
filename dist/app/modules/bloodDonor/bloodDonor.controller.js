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
exports.BloodDonorController = {
    getAllBloodDonors,
    getBloodDonorById,
    createBloodDonor,
    updateBloodDonor,
    deleteBloodDonor,
    getBloodDonorUserId,
};
