"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DonationService = void 0;
const prisma_1 = __importDefault(require("../../shared/prisma"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const bson_1 = require("bson");
const achievement_service_1 = require("../achievement/achievement.service");
async function getAllDonationOffers(params) {
    const { page = 1, limit = 10, status, bloodRequestId, userId } = params;
    const where = {
        ...(status && { status }),
        ...(bloodRequestId && { bloodRequestId }),
        ...(userId && { userId }),
    };
    const [donationOffers, total] = await Promise.all([
        prisma_1.default.donation.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * limit,
            take: limit,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        blood: true,
                        email: true,
                    },
                },
                bloodRequest: true,
            },
        }),
        prisma_1.default.donation.count({ where }),
    ]);
    return { donationOffers, total };
}
async function getAllMyRequestDonation(userId, id) {
    const userExist = await prisma_1.default.user.findUnique({
        where: {
            id: userId,
        },
    });
    if (!userExist) {
        throw new AppError_1.default(404, "User not found!");
    }
    const result = await prisma_1.default.donation.findMany({
        where: {
            bloodRequestId: id,
        },
        orderBy: { createdAt: "desc" },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                    blood: true,
                    email: true,
                },
            },
            bloodRequest: true,
        },
    });
    return result;
}
const singleDonation = async (userId, id) => {
    const userExist = await prisma_1.default.user.findUnique({
        where: {
            id: userId,
        },
    });
    if (!userExist) {
        throw new AppError_1.default(404, "User not found!");
    }
    const result = await prisma_1.default.donation.findFirst({
        where: {
            bloodRequestId: id,
            userId,
        },
        orderBy: { createdAt: "desc" },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                    blood: true,
                    email: true,
                },
            },
            bloodRequest: true,
        },
    });
    return result;
};
async function getDonationOfferById(id, userId) {
    if (!bson_1.ObjectId.isValid(id)) {
        throw new AppError_1.default(400, "Invalid donation offer ID format");
    }
    const donationOffer = await prisma_1.default.donation.findFirst({
        where: { userId, bloodRequestId: id },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                    blood: true,
                    email: true,
                    createdAt: true,
                },
            },
            bloodRequest: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
                            email: true,
                            createdAt: true,
                        },
                    },
                },
            },
        },
    });
    if (!donationOffer) {
        throw new AppError_1.default(404, "Donation offer not found");
    }
    return donationOffer;
}
async function createDonationOffer(userId, data) {
    console.log("createDonationOffer", data);
    // Check if user exists
    const user = await prisma_1.default.user.findUnique({ where: { id: userId } });
    if (!user) {
        throw new AppError_1.default(404, "User not found");
    }
    // Check if blood request exists
    const bloodRequest = await prisma_1.default.bloodRequest.findUnique({
        where: { id: data.bloodRequestId },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });
    if (!bloodRequest) {
        throw new AppError_1.default(404, "Blood request not found");
    }
    // Check if user's blood type matches the request
    /*
    if (user.blood !== bloodRequest.blood) {
      throw new AppError(400, "Your blood type does not match the request");
    }
  */
    // Check if user already has an offer for this request
    const existingOffer = await prisma_1.default.donation.findFirst({
        where: {
            userId,
            bloodRequestId: data.bloodRequestId,
        },
    });
    if (existingOffer) {
        throw new AppError_1.default(400, "You have already offered to donate for this request");
    }
    // Create donation offer
    const donationOffer = await prisma_1.default.donation.create({
        data: {
            userId,
            bloodRequestId: data.bloodRequestId,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                    blood: true,
                },
            },
            bloodRequest: true,
        },
    });
    /*
    // Send notification to blood request creator
    await notificationService.createNotification({
      userId: bloodRequest.userId,
      title: "New Donation Offer",
      body: `${user.name} has offered to donate blood for your request.`,
      url: `/requests/${bloodRequest.id}`,
    });
    */
    return donationOffer;
}
async function updateDonationOfferStatus(id, userId, data) {
    if (!bson_1.ObjectId.isValid(id)) {
        throw new AppError_1.default(400, "Invalid donation offer ID format");
    }
    // Get the donation offer
    const donationOffer = await prisma_1.default.donation.findUnique({
        where: { id },
        include: {
            user: true,
            bloodRequest: {
                include: {
                    user: true,
                },
            },
        },
    });
    if (!donationOffer) {
        throw new AppError_1.default(404, "Donation offer not found");
    }
    // Check if the user is either the donor or the blood request creator
    const isRequestCreator = donationOffer.bloodRequest.userId === userId;
    const isDonor = donationOffer.userId === userId;
    if (!isRequestCreator && !isDonor) {
        throw new AppError_1.default(403, "You are not authorized to update this donation offer");
    }
    // Validate status transitions
    if (donationOffer.status === "confirmed" && data.status !== "confirmed") {
        throw new AppError_1.default(400, "Cannot change status once donation is completed");
    }
    // Only request creator can accept/reject offers
    if ((data.status === "selected" || data.status === "cancelled") &&
        !isRequestCreator) {
        throw new AppError_1.default(403, "Only the blood request creator can accept or reject offers");
    }
    // Only request creator can mark as completed
    if (data.status === "confirmed" && !isRequestCreator) {
        throw new AppError_1.default(403, "Only the blood request creator can mark a donation as completed");
    }
    // Update the donation offer
    const updatedOffer = await prisma_1.default.donation.update({
        where: { id },
        data: {
            status: data.status,
            notes: data.message || donationOffer.notes,
        },
        include: {
            user: true,
            bloodRequest: {
                include: {
                    user: true,
                },
            },
        },
    });
    // If status is completed, update the donor's donation count
    if (data.status === "confirmed" && donationOffer.status !== "confirmed") {
        await prisma_1.default.user.update({
            where: { id: donationOffer.userId },
            data: {
                donationCount: {
                    increment: 1,
                },
                lastDonationDate: new Date(),
            },
        });
        // Check and update achievements
        await achievement_service_1.AchievementService.checkAndUpdateAchievements(donationOffer.userId);
        /*
        // Send notification to donor
        await notificationService.createNotification({
          userId: donationOffer.userId,
          title: "Donation Completed",
          body: "Your blood donation has been marked as completed. Thank you for saving lives!",
          url: `/donations/${donationOffer.id}`,
        });
        */
    }
    else if (data.status === "selected" &&
        donationOffer.status !== "selected") {
        /*
        // Send notification to donor when offer is accepted
        await notificationService.createNotification({
          userId: donationOffer.userId,
          title: "Donation Offer Accepted",
          body: `Your offer to donate blood for ${donationOffer.bloodRequest.patientName} has been accepted.`,
          url: `/donations/${donationOffer.id}`,
        });
        */
    }
    else if (data.status === "cancelled" &&
        donationOffer.status !== "cancelled") {
        /*
        // Send notification to donor when offer is rejected
        await notificationService.createNotification({
          userId: donationOffer.userId,
          title: "Donation Offer Rejected",
          body: "Your offer to donate blood has been rejected.",
          url: `/donations/${donationOffer.id}`,
        });
        */
    }
    return updatedOffer;
}
async function deleteDonationOffer(id, userId) {
    if (!bson_1.ObjectId.isValid(id)) {
        throw new AppError_1.default(400, "Invalid donation offer ID format");
    }
    const donationOffer = await prisma_1.default.donation.findUnique({
        where: { id },
        include: {
            bloodRequest: true,
        },
    });
    if (!donationOffer) {
        throw new AppError_1.default(404, "Donation offer not found");
    }
    // Check if the user is either the donor or the blood request creator
    const isRequestCreator = donationOffer.bloodRequest.userId === userId;
    const isDonor = donationOffer.userId === userId;
    if (!isRequestCreator && !isDonor) {
        throw new AppError_1.default(403, "You are not authorized to delete this donation offer");
    }
    // Don't allow deletion of completed donations
    if (donationOffer.status === "confirmed") {
        throw new AppError_1.default(400, "Cannot delete a completed donation");
    }
    const deletedOffer = await prisma_1.default.donation.delete({
        where: { id },
    });
    return deletedOffer;
}
async function cancelInterest(requestId, userId) {
    if (!bson_1.ObjectId.isValid(requestId)) {
        throw new AppError_1.default(400, "Invalid blood request ID format");
    }
    // Check if blood request exists
    const bloodRequest = await prisma_1.default.bloodRequest.findUnique({
        where: { id: requestId },
    });
    if (!bloodRequest) {
        throw new AppError_1.default(404, "Blood request not found");
    }
    // Check if user has an offer for this request
    const existingOffer = await prisma_1.default.donation.findFirst({
        where: {
            userId,
            bloodRequestId: requestId,
        },
    });
    if (!existingOffer) {
        throw new AppError_1.default(404, "You have not expressed interest in this blood request");
    }
    // Don't allow cancellation of completed donations
    if (existingOffer.status === "confirmed") {
        throw new AppError_1.default(400, "Cannot cancel a completed donation");
    }
    // Delete the donation offer
    await prisma_1.default.donation.delete({
        where: { id: existingOffer.id },
    });
    return { success: true };
}
async function getInterestedDonorDetails(requestId, donorUserId, loaders) {
    if (!bson_1.ObjectId.isValid(requestId) || !bson_1.ObjectId.isValid(donorUserId)) {
        throw new AppError_1.default(400, "Invalid ID format");
    }
    // Check if blood request exists - use dataloader if available
    let bloodRequest;
    try {
        if (loaders?.bloodRequestLoader) {
            bloodRequest = await loaders.bloodRequestLoader.load(requestId);
        }
        else {
            bloodRequest = await prisma_1.default.bloodRequest.findUnique({
                where: { id: requestId },
            });
        }
    }
    catch (error) {
        // Fallback to direct database query if loader fails
        bloodRequest = await prisma_1.default.bloodRequest.findUnique({
            where: { id: requestId },
        });
    }
    if (!bloodRequest) {
        throw new AppError_1.default(404, "Blood request not found");
    }
    // Get donation offer
    const donationOffer = await prisma_1.default.donation.findFirst({
        where: {
            userId: donorUserId,
            bloodRequestId: requestId,
        },
    });
    if (!donationOffer) {
        throw new AppError_1.default(404, "Donation offer not found");
    }
    // Get user details - use dataloader if available
    let user;
    try {
        if (loaders?.userLoader) {
            user = await loaders.userLoader.load(donorUserId);
        }
        else {
            user = await prisma_1.default.user.findUnique({
                where: { id: donorUserId },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    blood: true,
                    gender: true,
                    division: true,
                    district: true,
                    upazila: true,
                    address: true,
                    lastDonationDate: true,
                    donationCount: true,
                    rewardBadge: true,
                },
            });
        }
    }
    catch (error) {
        // Fallback to direct database query if loader fails
        user = await prisma_1.default.user.findUnique({
            where: { id: donorUserId },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                blood: true,
                gender: true,
                division: true,
                district: true,
                upazila: true,
                address: true,
                lastDonationDate: true,
                donationCount: true,
                rewardBadge: true,
            },
        });
    }
    if (!user) {
        throw new AppError_1.default(404, "User not found");
    }
    // Get donor info - use dataloader if available
    let donorInfo;
    try {
        if (loaders?.bloodDonorLoader) {
            donorInfo = await loaders.bloodDonorLoader.load(donorUserId);
        }
        else {
            donorInfo = await prisma_1.default.bloodDonor.findUnique({
                where: { userId: donorUserId },
            });
        }
    }
    catch (error) {
        // Fallback to direct database query if loader fails
        donorInfo = await prisma_1.default.bloodDonor.findUnique({
            where: { userId: donorUserId },
        });
    }
    // Combine user and donation offer details
    return {
        ...user,
        donorInfo,
        donationOffer: {
            id: donationOffer.id,
            status: donationOffer.status,
            notes: donationOffer.notes,
            createdAt: donationOffer.createdAt,
            updatedAt: donationOffer.updatedAt,
        },
    };
}
async function updateDonorStatus(requestId, donorUserId, status, notes, currentUserId) {
    if (!bson_1.ObjectId.isValid(requestId) || !bson_1.ObjectId.isValid(donorUserId)) {
        throw new AppError_1.default(400, "Invalid ID format");
    }
    // Check if blood request exists
    const bloodRequest = await prisma_1.default.bloodRequest.findUnique({
        where: { id: requestId },
        include: {
            user: true,
        },
    });
    if (!bloodRequest) {
        throw new AppError_1.default(404, "Blood request not found");
    }
    // Only the blood request creator can update donor status
    if (bloodRequest.userId !== currentUserId) {
        throw new AppError_1.default(403, "Only the blood request creator can update donor status");
    }
    // Get donation offer
    const donationOffer = await prisma_1.default.donation.findFirst({
        where: {
            userId: donorUserId,
            bloodRequestId: requestId,
        },
    });
    if (!donationOffer) {
        throw new AppError_1.default(404, "Donation offer not found");
    }
    // Map frontend status to backend status
    let backendStatus;
    switch (status) {
        case "selected":
            backendStatus = "selected";
            break;
        case "confirmed":
            backendStatus = "confirmed";
            break;
        case "cancelled":
            backendStatus = "cancelled";
            break;
        default:
            backendStatus = status;
    }
    // Update donation status
    const updatedDonation = await prisma_1.default.donation.update({
        where: { id: donationOffer.id },
        data: { status: backendStatus, notes },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });
    // If status is completed, update the donor's donation count
    if (backendStatus === "confirmed" && donationOffer.status !== "confirmed") {
        await prisma_1.default.user.update({
            where: { id: donorUserId },
            data: {
                donationCount: {
                    increment: 1,
                },
                lastDonationDate: new Date(),
            },
        });
        // Check and update achievements
        await achievement_service_1.AchievementService.checkAndUpdateAchievements(donorUserId);
        // Send notification to donor
        /*
        try {
          await notificationService.createNotification({
            userId: donorUserId,
            title: "Donation Completed",
            body: "Your blood donation has been marked as completed. Thank you for saving lives!",
            url: `/donations/${donationOffer.id}`,
          });
        } catch (error) {
          console.error("Failed to send notification:", error);
        }
          */
    }
    else if (backendStatus === "selected" &&
        donationOffer.status !== "selected") {
        // Send notification to donor when offer is accepted
        /*
        try {
          await notificationService.createNotification({
            userId: donorUserId,
            title: "Donation Offer Accepted",
            body: `Your offer to donate blood for ${bloodRequest.patientName} has been accepted.`,
            url: `/donations/${donationOffer.id}`,
          });
        } catch (error) {
          console.error("Failed to send notification:", error);
        }
          */
    }
    else if (backendStatus === "cancelled" &&
        donationOffer.status !== "cancelled") {
        // Send notification to donor when offer is rejected
        /*
        try {
          await notificationService.createNotification({
            userId: donorUserId,
            title: "Donation Offer Rejected",
            body: "Your offer to donate blood has been rejected.",
            url: `/donations/${donationOffer.id}`,
          });
        } catch (error) {
          console.error("Failed to send notification:", error);
        }
          */
    }
    return { success: true };
}
exports.DonationService = {
    getAllDonationOffers,
    getDonationOfferById,
    createDonationOffer,
    updateDonationOfferStatus,
    deleteDonationOffer,
    getAllMyRequestDonation,
    singleDonation,
    cancelInterest,
    getInterestedDonorDetails,
    updateDonorStatus,
};
