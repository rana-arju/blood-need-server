"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLoaders = createLoaders;
const dataloader_1 = __importDefault(require("dataloader"));
const prisma_1 = __importDefault(require("./prisma"));
// Create a factory for dataloaders
function createLoaders() {
    // User loader
    const userLoader = new dataloader_1.default(async (ids) => {
        const users = await prisma_1.default.user.findMany({
            where: {
                id: {
                    in: [...ids],
                },
            },
        });
        // Map users to the order of ids
        const userMap = {};
        users.forEach((user) => {
            userMap[user.id] = user;
        });
        return ids.map((id) => userMap[id] || null);
    });
    // Blood donor loader
    const bloodDonorLoader = new dataloader_1.default(async (userIds) => {
        const donors = await prisma_1.default.bloodDonor.findMany({
            where: {
                userId: {
                    in: [...userIds],
                },
            },
        });
        // Map donors to the order of userIds
        const donorMap = {};
        donors.forEach((donor) => {
            donorMap[donor.userId] = donor;
        });
        return userIds.map((userId) => donorMap[userId] || null);
    });
    // Blood request loader
    const bloodRequestLoader = new dataloader_1.default(async (ids) => {
        const requests = await prisma_1.default.bloodRequest.findMany({
            where: {
                id: {
                    in: [...ids],
                },
            },
        });
        // Map requests to the order of ids
        const requestMap = {};
        requests.forEach((request) => {
            requestMap[request.id] = request;
        });
        return ids.map((id) => requestMap[id] || null);
    });
    // Return all loaders
    return {
        userLoader,
        bloodDonorLoader,
        bloodRequestLoader,
    };
}
