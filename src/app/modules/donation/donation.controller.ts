import type { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { DonationService } from "./donation.service";
import prisma from "../../shared/prisma";
import AppError from "../../error/AppError";

const getAllDonationOffers = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, status, bloodRequestId, userId } = req.query;

  const params = {
    page: page ? Number.parseInt(page as string) : undefined,
    limit: limit ? Number.parseInt(limit as string) : undefined,
    status: status as
      | "pending"
      | "selected"
      | "cancelled"
      | "confirmed"
      | undefined,
    bloodRequestId: bloodRequestId as string | undefined,
    userId: userId as string | undefined,
  };

  const { donationOffers, total } = await DonationService.getAllDonationOffers(
    params
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Donation offers retrieved successfully",
    data: donationOffers,
    meta: {
      total,
      page: params.page || 1,
      limit: params.limit || 10,
      // totalPages: Math.ceil(total / (params.limit || 10)),
    },
  });
});

const getMyDonationOffers = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id!;
  const { id } = req.params;

  const result = await DonationService.getAllMyRequestDonation(userId, id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "My donation offers retrieved successfully",
    data: result,
  });
});
const getSingleDonation = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id!;
  const { id } = req.params;

  const result = await DonationService.singleDonation(userId, id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "My donation offers retrieved successfully",
    data: result,
  });
});

const getMyDonations = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const userExist = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!userExist) {
    throw new AppError(404, "This user not found!");
  }

  const result = await prisma.donation.findMany({
    where: { userId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          blood: true,
          lastDonationDate: true,
          gender: true,
          donorInfo: true,
          role: true,
        },
      },
      bloodRequest: true,
    },
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Donation retrieved successfully",
    data: result,
  });
});

const getDonationOfferById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id!;
  const result = await DonationService.getDonationOfferById(id, userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Donation offer retrieved successfully",
    data: result,
  });
});

const createDonationOffer = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id!;
  const result = await DonationService.createDonationOffer(userId, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Donation offer created successfully",
    data: result,
  });
});

const updateDonationOfferStatus = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.id!;
    const result = await DonationService.updateDonationOfferStatus(
      id,
      userId,
      req.body
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Donation offer updated successfully",
      data: result,
    });
  }
);

const deleteDonationOffer = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id!;
  const result = await DonationService.deleteDonationOffer(id, userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Donation offer deleted successfully",
    data: result,
  });
});

// New endpoints to match frontend API calls

const cancelInterest = catchAsync(async (req: Request, res: Response) => {
  const { requestId } = req.params;
  const userId = req.user?.id!;

  const result = await DonationService.cancelInterest(requestId, userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Interest cancelled successfully",
    data: result,
  });
});

const getInterestedDonorDetails = catchAsync(
  async (req: Request, res: Response) => {
    const { requestId, userId } = req.params;

    const result = await DonationService.getInterestedDonorDetails(
      requestId,
      userId,
      req.loaders // Pass the loaders from the request
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Donor details retrieved successfully",
      data: result,
    });
  }
);

const updateDonorStatus = catchAsync(async (req: Request, res: Response) => {
  const { requestId, userId } = req.params;
  const { status, notes } = req.body;
  const currentUserId = req.user?.id!;

  const result = await DonationService.updateDonorStatus(
    requestId,
    userId,
    status,
    notes,
    currentUserId
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Donor status updated successfully",
    data: result,
  });
});
export const DonationController = {
  getAllDonationOffers,
  getMyDonationOffers,
  getMyDonations,
  getDonationOfferById,
  createDonationOffer,
  updateDonationOfferStatus,
  deleteDonationOffer,
  getSingleDonation,

  cancelInterest,
  getInterestedDonorDetails,
  updateDonorStatus,
};
