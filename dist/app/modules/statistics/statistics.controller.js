"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatisticsController = void 0;
const statistics_service_1 = require("./statistics.service");
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const getStatistics = (0, catchAsync_1.default)(async (req, res) => {
    const result = await statistics_service_1.StatisticsService.getStatistics();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Statistics retrieved successfully",
        data: result,
    });
});
exports.StatisticsController = {
    getStatistics,
};
