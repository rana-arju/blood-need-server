import type { Prisma } from "@prisma/client";
import prisma from "../../shared/prisma";
import AppError from "../../error/AppError";
import { ObjectId } from "bson";
import { AchievementService } from "../achievement/achievement.service";

interface GetAllDonationOffersParams {
  page?: number;
  limit?: number;
  status?: "pending" | "selected" | "cancelled" | "confirmed";
  bloodRequestId?: string;
  userId?: string;
}

async function getAllDonationOffers(params: GetAllDonationOffersParams) {
  const { page = 1, limit = 10, status, bloodRequestId, userId } = params;

  const where: Prisma.DonationWhereInput = {
    ...(status && { status }),
    ...(bloodRequestId && { bloodRequestId }),
    ...(userId && { userId }),
  };

  const [donationOffers, total] = await Promise.all([
    prisma.donation.findMany({
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
    prisma.donation.count({ where }),
  ]);

  return { donationOffers, total };
}
async function getAllMyRequestDonation(userId: string, id: string) {
  const userExist = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!userExist) {
    throw new AppError(404, "User not found!");
  }

  const result = await prisma.donation.findMany({
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
const singleDonation = async (userId: string, id: string) => {
  const userExist = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!userExist) {
    throw new AppError(404, "User not found!");
  }

  const result = await prisma.donation.findFirst({
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
async function getDonationOfferById(id: string, userId: string) {
  if (!ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid donation offer ID format");
  }

  const donationOffer = await prisma.donation.findFirst({
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
    throw new AppError(404, "Donation offer not found");
  }

  return donationOffer;
}

async function createDonationOffer(
  userId: string,
  data: { bloodRequestId: string; userId: string }
) {
  console.log("createDonationOffer", data);

  // Check if user exists
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError(404, "User not found");
  }

  // Check if blood request exists
  const bloodRequest = await prisma.bloodRequest.findUnique({
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
    throw new AppError(404, "Blood request not found");
  }
  // Check if user's blood type matches the request
  /*
  if (user.blood !== bloodRequest.blood) {
    throw new AppError(400, "Your blood type does not match the request");
  }
*/
  // Check if user already has an offer for this request
  const existingOffer = await prisma.donation.findFirst({
    where: {
      userId,
      bloodRequestId: data.bloodRequestId,
    },
  });

  if (existingOffer) {
    throw new AppError(
      400,
      "You have already offered to donate for this request"
    );
  }

  // Create donation offer
  const donationOffer = await prisma.donation.create({
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

async function updateDonationOfferStatus(
  id: string,
  userId: string,
  data: {
    status: "pending" | "selected" | "cancelled" | "confirmed";
    message?: string;
  }
) {
  if (!ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid donation offer ID format");
  }

  // Get the donation offer
  const donationOffer = await prisma.donation.findUnique({
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
    throw new AppError(404, "Donation offer not found");
  }

  // Check if the user is either the donor or the blood request creator
  const isRequestCreator = donationOffer.bloodRequest.userId === userId;
  const isDonor = donationOffer.userId === userId;

  if (!isRequestCreator && !isDonor) {
    throw new AppError(
      403,
      "You are not authorized to update this donation offer"
    );
  }

  // Validate status transitions
  if (donationOffer.status === "confirmed" && data.status !== "confirmed") {
    throw new AppError(400, "Cannot change status once donation is completed");
  }

  // Only request creator can accept/reject offers
  if (
    (data.status === "selected" || data.status === "cancelled") &&
    !isRequestCreator
  ) {
    throw new AppError(
      403,
      "Only the blood request creator can accept or reject offers"
    );
  }

  // Only request creator can mark as completed
  if (data.status === "confirmed" && !isRequestCreator) {
    throw new AppError(
      403,
      "Only the blood request creator can mark a donation as completed"
    );
  }

  // Update the donation offer
  const updatedOffer = await prisma.donation.update({
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
    await prisma.user.update({
      where: { id: donationOffer.userId },
      data: {
        donationCount: {
          increment: 1,
        },
        lastDonationDate: new Date(),
      },
    });

    // Check and update achievements
    await AchievementService.checkAndUpdateAchievements(donationOffer.userId);
    /*
    // Send notification to donor
    await notificationService.createNotification({
      userId: donationOffer.userId,
      title: "Donation Completed",
      body: "Your blood donation has been marked as completed. Thank you for saving lives!",
      url: `/donations/${donationOffer.id}`,
    });
    */
  } else if (
    data.status === "selected" &&
    donationOffer.status !== "selected"
  ) {
    /*
    // Send notification to donor when offer is accepted
    await notificationService.createNotification({
      userId: donationOffer.userId,
      title: "Donation Offer Accepted",
      body: `Your offer to donate blood for ${donationOffer.bloodRequest.patientName} has been accepted.`,
      url: `/donations/${donationOffer.id}`,
    });
    */
  } else if (
    data.status === "cancelled" &&
    donationOffer.status !== "cancelled"
  ) {
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

async function deleteDonationOffer(id: string, userId: string) {
  if (!ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid donation offer ID format");
  }

  const donationOffer = await prisma.donation.findUnique({
    where: { id },
    include: {
      bloodRequest: true,
    },
  });

  if (!donationOffer) {
    throw new AppError(404, "Donation offer not found");
  }

  // Check if the user is either the donor or the blood request creator
  const isRequestCreator = donationOffer.bloodRequest.userId === userId;
  const isDonor = donationOffer.userId === userId;

  if (!isRequestCreator && !isDonor) {
    throw new AppError(
      403,
      "You are not authorized to delete this donation offer"
    );
  }

  // Don't allow deletion of completed donations
  if (donationOffer.status === "confirmed") {
    throw new AppError(400, "Cannot delete a completed donation");
  }

  const deletedOffer = await prisma.donation.delete({
    where: { id },
  });

  return deletedOffer;
}

async function cancelInterest(requestId: string, userId: string) {
  if (!ObjectId.isValid(requestId)) {
    throw new AppError(400, "Invalid blood request ID format");
  }

  // Check if blood request exists
  const bloodRequest = await prisma.bloodRequest.findUnique({
    where: { id: requestId },
  });

  if (!bloodRequest) {
    throw new AppError(404, "Blood request not found");
  }

  // Check if user has an offer for this request
  const existingOffer = await prisma.donation.findFirst({
    where: {
      userId,
      bloodRequestId: requestId,
    },
  });

  if (!existingOffer) {
    throw new AppError(
      404,
      "You have not expressed interest in this blood request"
    );
  }

  // Don't allow cancellation of completed donations
  if (existingOffer.status === "confirmed") {
    throw new AppError(400, "Cannot cancel a completed donation");
  }

  // Delete the donation offer
  await prisma.donation.delete({
    where: { id: existingOffer.id },
  });

  return { success: true };
}

async function getInterestedDonorDetails(
  requestId: string,
  donorUserId: string
) {
  if (!ObjectId.isValid(requestId) || !ObjectId.isValid(donorUserId)) {
    throw new AppError(400, "Invalid ID format");
  }

  // Check if blood request exists
  const bloodRequest = await prisma.bloodRequest.findUnique({
    where: { id: requestId },
  });

  if (!bloodRequest) {
    throw new AppError(404, "Blood request not found");
  }

  // Get donation offer
  const donationOffer = await prisma.donation.findFirst({
    where: {
      userId: donorUserId,
      bloodRequestId: requestId,
    },
  });

  if (!donationOffer) {
    throw new AppError(404, "Donation offer not found");
  }

  // Get user details
  const user = await prisma.user.findUnique({
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
      donorInfo: true,
    },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  // Combine user and donation offer details
  return {
    ...user,
    donationOffer: {
      id: donationOffer.id,
      status: donationOffer.status,
      notes: donationOffer.notes,
      createdAt: donationOffer.createdAt,
      updatedAt: donationOffer.updatedAt,
    },
  };
}

async function updateDonorStatus(
  requestId: string,
  donorUserId: string,
  status: "pending" | "selected" | "cancelled" | "confirmed",
  notes: string,
  currentUserId: string
) {
  if (!ObjectId.isValid(requestId) || !ObjectId.isValid(donorUserId)) {
    throw new AppError(400, "Invalid ID format");
  }

  // Check if blood request exists
  const bloodRequest = await prisma.bloodRequest.findUnique({
    where: { id: requestId },
    include: {
      user: true,
    },
  });

  if (!bloodRequest) {
    throw new AppError(404, "Blood request not found");
  }

  // Only the blood request creator can update donor status
  if (bloodRequest.userId !== currentUserId) {
    throw new AppError(
      403,
      "Only the blood request creator can update donor status"
    );
  }

  // Get donation offer
  const donationOffer = await prisma.donation.findFirst({
    where: {
      userId: donorUserId,
      bloodRequestId: requestId,
    },
  });

  if (!donationOffer) {
    throw new AppError(404, "Donation offer not found");
  }

  // Map frontend status to backend status
  let backendStatus: "pending" | "selected" | "cancelled" | "confirmed";
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
  const updatedDonation = await prisma.donation.update({
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
    await prisma.user.update({
      where: { id: donorUserId },
      data: {
        donationCount: {
          increment: 1,
        },
        lastDonationDate: new Date(),
      },
    });

    // Check and update achievements
    await AchievementService.checkAndUpdateAchievements(donorUserId);

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
  } else if (
    backendStatus === "selected" &&
    donationOffer.status !== "selected"
  ) {
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
  } else if (
    backendStatus === "cancelled" &&
    donationOffer.status !== "cancelled"
  ) {
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

export const DonationService = {
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
