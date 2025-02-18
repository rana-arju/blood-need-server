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
exports.BloodDriveController = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const pick_1 = __importDefault(require("../../shared/pick"));
const bloodDrive_constant_1 = require("./bloodDrive.constant");
const bloodDrive_service_1 = require("./bloodDrive.service");
const pagination_1 = require("../../constants/pagination");
const getAllBloodDrives = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, bloodDrive_constant_1.bloodDriveFilterableFields);
    const paginationOptions = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = yield bloodDrive_service_1.BloodDriveService.getAllBloodDrives(filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Blood drives retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
}));
const getBloodDriveById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield bloodDrive_service_1.BloodDriveService.getBloodDriveById(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Blood drive retrieved successfully",
        data: result,
    });
}));
const createBloodDrive = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield bloodDrive_service_1.BloodDriveService.createBloodDrive(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Blood drive created successfully",
        data: result,
    });
}));
const updateBloodDrive = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield bloodDrive_service_1.BloodDriveService.updateBloodDrive(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Blood drive updated successfully",
        data: result,
    });
}));
const deleteBloodDrive = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield bloodDrive_service_1.BloodDriveService.deleteBloodDrive(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Blood drive deleted successfully",
        data: result,
    });
}));
exports.BloodDriveController = {
    getAllBloodDrives,
    getBloodDriveById,
    createBloodDrive,
    updateBloodDrive,
    deleteBloodDrive,
};
