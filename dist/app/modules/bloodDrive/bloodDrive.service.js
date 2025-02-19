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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BloodDriveService = void 0;
const paginationHelper_1 = require("../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const getAllBloodDrives = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, organizer, startDate, endDate } = filters;
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: ["name", "location", "description"].map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    if (organizer) {
        andConditions.push({ organizer });
    }
    if (startDate && endDate) {
        andConditions.push({
            date: {
                gte: startDate,
                lte: endDate,
            },
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.bloodDrive.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
    });
    const total = yield prisma_1.default.bloodDrive.count({ where: whereConditions });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getBloodDriveById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.bloodDrive.findUnique({
        where: { id },
    });
    return result;
});
const createBloodDrive = (bloodDriveData) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.bloodDrive.create({
        data: Object.assign(Object.assign({}, bloodDriveData), { user: {
                connect: { id: bloodDriveData.user.connect.id },
            } }),
    });
    return result;
});
const updateBloodDrive = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = payload, updateData = __rest(payload, ["userId"]);
    const result = yield prisma_1.default.bloodDrive.update({
        where: { id },
        data: updateData,
    });
    return result;
});
const deleteBloodDrive = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.bloodDrive.delete({
        where: { id },
    });
    return result;
});
exports.BloodDriveService = {
    getAllBloodDrives,
    getBloodDriveById,
    createBloodDrive,
    updateBloodDrive,
    deleteBloodDrive,
};
