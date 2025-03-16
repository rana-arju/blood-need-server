"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthRecordController = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const healthRecord_service_1 = require("./healthRecord.service");
const getAllHealthRecords = (0, catchAsync_1.default)(async (req, res) => {
    const result = await healthRecord_service_1.HealthRecordService.getAllHealthRecords();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Health records retrieved successfully",
        data: result,
    });
});
const getHealthRecordById = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await healthRecord_service_1.HealthRecordService.getHealthRecordById(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Health record retrieved successfully",
        data: result,
    });
});
const getHealthRecordsByUserId = (0, catchAsync_1.default)(async (req, res) => {
    const { userId } = req.params;
    const result = await healthRecord_service_1.HealthRecordService.getHealthRecordsByUserId(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Health records retrieved successfully",
        data: result,
    });
});
const getMyHealthRecords = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.id;
    const result = await healthRecord_service_1.HealthRecordService.getHealthRecordsByUserId(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "My health records retrieved successfully",
        data: result,
    });
});
const createHealthRecord = (0, catchAsync_1.default)(async (req, res) => {
    const result = await healthRecord_service_1.HealthRecordService.createHealthRecord(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Health record created successfully",
        data: result,
    });
});
const updateHealthRecord = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await healthRecord_service_1.HealthRecordService.updateHealthRecord(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Health record updated successfully",
        data: result,
    });
});
const deleteHealthRecord = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await healthRecord_service_1.HealthRecordService.deleteHealthRecord(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Health record deleted successfully",
        data: result,
    });
});
exports.HealthRecordController = {
    getAllHealthRecords,
    getHealthRecordById,
    getHealthRecordsByUserId,
    getMyHealthRecords,
    createHealthRecord,
    updateHealthRecord,
    deleteHealthRecord,
};
