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
exports.UserService = void 0;
const client_1 = require("@prisma/client");
const paginationHelper_1 = require("../../helpers/paginationHelper");
const AppError_1 = __importDefault(require("../../error/AppError"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
const randomPass = Math.random().toString(36).slice(2, 12);
const getAllUsers = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, bloodType } = filters;
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: ["name", "email"].map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    if (bloodType) {
        andConditions.push({
            bloodType: {
                equals: bloodType,
            },
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma.user.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
    });
    const total = yield prisma.user.count({ where: whereConditions });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const password = (payload === null || payload === void 0 ? void 0 : payload.password) || randomPass;
    const userExist = yield prisma.user.findUnique({
        where: {
            email: payload === null || payload === void 0 ? void 0 : payload.email,
        },
    });
    if (userExist) {
        if ((userExist === null || userExist === void 0 ? void 0 : userExist.provider) && (userExist === null || userExist === void 0 ? void 0 : userExist.provider) == "google" ||
            (userExist === null || userExist === void 0 ? void 0 : userExist.provider) == "facebook") {
            return userExist;
        }
        throw new AppError_1.default(401, "User already exist!");
    }
    // 🔹 Hash the password before storing it
    const hashedPassword = yield bcrypt_1.default.hash(password, 10); // 10 = salt rounds
    payload.password = hashedPassword;
    const result = yield prisma.user.create({
        data: payload,
    });
    return result;
});
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const password = payload === null || payload === void 0 ? void 0 : payload.password;
    const userExist = yield prisma.user.findUnique({
        where: {
            email: payload.email,
        },
    });
    if (!userExist) {
        throw new AppError_1.default(401, "User does not exist!");
    }
    // 🔹 Compare the password
    const isMatch = yield bcrypt_1.default.compare(password, userExist.password);
    if (!isMatch)
        throw new AppError_1.default(401, "Invalid email or password");
    return userExist;
});
const updateUser = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma.user.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
});
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma.user.delete({
        where: {
            id,
        },
    });
    return result;
});
exports.UserService = {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    loginUser,
};
