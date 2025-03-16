"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("./user.service");
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const pick_1 = __importDefault(require("../../shared/pick"));
const pagination_1 = require("../../constants/pagination");
const user_constant_1 = require("./user.constant");
const getAllUsers = (0, catchAsync_1.default)(async (req, res) => {
    const filters = (0, pick_1.default)(req.query, user_constant_1.userFilterableFields);
    const paginationOptions = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = await user_service_1.UserService.getAllUsers(filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Users retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});
const createUser = (0, catchAsync_1.default)(async (req, res) => {
    const result = await user_service_1.UserService.createUser(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "User created successfully",
        data: result,
    });
});
const login = (0, catchAsync_1.default)(async (req, res) => {
    const result = await user_service_1.UserService.loginUser(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "User login successfully",
        data: result,
    });
});
const updateUser = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await user_service_1.UserService.updateUser(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "User updated successfully",
        data: result,
    });
});
const updatePassword = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;
    const result = await user_service_1.UserService.updatePassword(id, password);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "User password updated successfully",
        data: result,
    });
});
const deleteUser = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await user_service_1.UserService.deleteUser(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "User deleted successfully",
        data: result,
    });
});
const singleUser = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await user_service_1.UserService.getMeUser(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "get me successfully",
        data: result,
    });
});
const getUserById = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await user_service_1.UserService.getUser(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "get me successfully",
        data: result,
    });
});
exports.UserController = {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    login,
    singleUser,
    getUserById,
    updatePassword,
};
