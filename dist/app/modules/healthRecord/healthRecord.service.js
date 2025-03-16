"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthRecordService = void 0;
const prisma_1 = __importDefault(require("../../shared/prisma"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const bson_1 = require("bson");
const getAllHealthRecords = async () => {
    const healthRecords = await prisma_1.default.healthRecord.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    blood: true,
                    dateOfBirth: true,
                    lastDonationDate: true,
                    donationCount: true,
                    donorInfo: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return healthRecords;
};
const getHealthRecordById = async (id) => {
    if (!bson_1.ObjectId.isValid(id)) {
        throw new AppError_1.default(400, "Invalid health record ID format");
    }
    const healthRecord = await prisma_1.default.healthRecord.findUnique({
        where: { id },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    blood: true,
                    dateOfBirth: true,
                    lastDonationDate: true,
                    donationCount: true,
                    donorInfo: true,
                },
            },
        },
    });
    if (!healthRecord) {
        throw new AppError_1.default(404, "Health record not found");
    }
    return healthRecord;
};
const getHealthRecordsByUserId = async (userId) => {
    if (!bson_1.ObjectId.isValid(userId)) {
        throw new AppError_1.default(400, "Invalid user ID format");
    }
    // Check if user exists
    const user = await prisma_1.default.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            blood: true,
            dateOfBirth: true,
            lastDonationDate: true,
            donationCount: true,
            donorInfo: true,
        },
    });
    if (!user) {
        throw new AppError_1.default(404, "User not found");
    }
    const healthRecords = await prisma_1.default.healthRecord.findMany({
        where: { userId },
        orderBy: {
            date: "desc",
        },
    });
    // Return health records with user data included
    return healthRecords.map((record) => ({
        ...record,
        user,
    }));
};
const createHealthRecord = async (data) => {
    if (!bson_1.ObjectId.isValid(data.userId)) {
        throw new AppError_1.default(400, "Invalid user ID format");
    }
    // Check if user exists
    const user = await prisma_1.default.user.findUnique({
        where: { id: data.userId },
        select: {
            id: true,
            name: true,
            email: true,
            blood: true,
            dateOfBirth: true,
            lastDonationDate: true,
            donationCount: true,
            donorInfo: true,
        },
    });
    if (!user) {
        throw new AppError_1.default(404, "User not found");
    }
    const healthRecord = await prisma_1.default.healthRecord.create({
        data,
    });
    // Return the created record with user data
    return {
        ...healthRecord,
        user,
    };
};
const updateHealthRecord = async (id, data) => {
    if (!bson_1.ObjectId.isValid(id)) {
        throw new AppError_1.default(400, "Invalid health record ID format");
    }
    // Get the health record to check if it exists and get the userId
    const existingRecord = await prisma_1.default.healthRecord.findUnique({
        where: { id },
    });
    if (!existingRecord) {
        throw new AppError_1.default(404, "Health record not found");
    }
    // Separate data for different models
    const healthRecordData = {};
    const userData = {};
    const donorData = {};
    // Health record fields
    if (data.date !== undefined)
        healthRecordData.date = data.date;
    if (data.hemoglobin !== undefined)
        healthRecordData.hemoglobin = data.hemoglobin;
    if (data.bloodPressure !== undefined)
        healthRecordData.bloodPressure = data.bloodPressure;
    if (data.pulse !== undefined)
        healthRecordData.pulse = data.pulse;
    if (data.notes !== undefined)
        healthRecordData.notes = data.notes;
    // User fields
    if (data.blood !== undefined)
        userData.blood = data.blood;
    if (data.dateOfBirth !== undefined)
        userData.dateOfBirth = data.dateOfBirth;
    if (data.lastDonationDate !== undefined)
        userData.lastDonationDate = data.lastDonationDate;
    // Donor fields
    if (data.weight !== undefined)
        donorData.weight = data.weight;
    if (data.height !== undefined)
        donorData.height = data.height;
    // Use a transaction to update all related models
    await prisma_1.default.$transaction(async (tx) => {
        // Update health record
        await tx.healthRecord.update({
            where: { id },
            data: healthRecordData,
        });
        // Update user if there are user fields to update
        if (Object.keys(userData).length > 0) {
            await tx.user.update({
                where: { id: existingRecord.userId },
                data: userData,
            });
        }
        // Update donor if there are donor fields to update
        if (Object.keys(donorData).length > 0) {
            try {
                await tx.bloodDonor.update({
                    where: { userId: existingRecord.userId },
                    data: donorData,
                });
            }
            catch (err) {
                // If donor record doesn't exist, create it
                if (err.code === "P2025") {
                    await tx.bloodDonor.create({
                        data: {
                            ...donorData,
                            userId: existingRecord.userId,
                            phone: "temp-" + Date.now(), // Temporary phone as it's required
                            emergencyContact: "temp-" + Date.now(), // Temporary emergency contact as it's required
                        },
                    });
                }
                else {
                    throw err;
                }
            }
        }
    });
    // Fetch and return the updated record with related data
    const updatedRecord = await prisma_1.default.healthRecord.findUnique({
        where: { id },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    blood: true,
                    dateOfBirth: true,
                    lastDonationDate: true,
                    donationCount: true,
                    donorInfo: true,
                },
            },
        },
    });
    return updatedRecord;
};
const deleteHealthRecord = async (id) => {
    if (!bson_1.ObjectId.isValid(id)) {
        throw new AppError_1.default(400, "Invalid health record ID format");
    }
    const healthRecord = await prisma_1.default.healthRecord.findUnique({
        where: { id },
    });
    if (!healthRecord) {
        throw new AppError_1.default(404, "Health record not found");
    }
    await prisma_1.default.healthRecord.delete({
        where: { id },
    });
    return { success: true, message: "Health record deleted successfully" };
};
exports.HealthRecordService = {
    getAllHealthRecords,
    getHealthRecordById,
    getHealthRecordsByUserId,
    createHealthRecord,
    updateHealthRecord,
    deleteHealthRecord,
};
