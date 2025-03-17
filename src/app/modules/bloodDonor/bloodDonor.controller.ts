import type { Request, Response } from "express";
import { BloodDonorService } from "./bloodDonor.service";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import pick from "../../shared/pick";
import { bloodDonorFilterableFields } from "./bloodDonor.constant";
import { paginationFields } from "../../constants/pagination";
import prisma from "../../shared/prisma";

const getAllBloodDonors = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, bloodDonorFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await BloodDonorService.getAllBloodDonors(
    filters,
    paginationOptions
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Blood donors retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getBloodDonorById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BloodDonorService.getBloodDonorById(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Blood donor retrieved successfully",
    data: result,
  });
});
const getBloodDonorUserId = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BloodDonorService.getBloodDonorByUserId(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Blood donor retrieved successfully",
    data: result,
  });
});

const createBloodDonor = catchAsync(async (req: Request, res: Response) => {
  const result = await BloodDonorService.createBloodDonor(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Blood donor created successfully",
    data: result,
  });
});

const updateBloodDonor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BloodDonorService.updateBloodDonor(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Blood donor updated successfully",
    data: result,
  });
});

const deleteBloodDonor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BloodDonorService.deleteBloodDonor(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Blood donor deleted successfully",
    data: result,
  });
});
// Get top donors based on donation count
const getTopDonors = async (req: Request, res: Response) => {
  try {
    const limit = Number.parseInt(req.query.limit as string) || 6;

    // Get users with donation counts
    const usersWithDonations = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        blood: true,
        image: true,
        createdAt: true,
        donations: {
          where: {
            status: "confirmed",
          },
        },
      },
      orderBy: [
        {
          donations: {
            _count: "desc",
          },
        },
        {
          createdAt: "asc", // Secondary sort by creation date (for new users)
        },
      ],
      take: limit,
    });

    // Map and transform the data
    const donors = usersWithDonations.map((user, index) => {
      const donationCount = user.donations.length;

      return {
        id: user.id,
        name: user.name,
        donations: donationCount,
        blood: user.blood || "Unknown",
        image: user.image,
        rank: index + 1,
        createdAt: user.createdAt,
      };
    });

    // If all users have 0 donations, get newest users instead
    if (donors.length > 0 && donors.every((donor) => donor.donations === 0)) {
      const newUsers = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          blood: true,
          image: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: limit,
      });

      const newDonors = newUsers.map((user, index) => ({
        id: user.id,
        name: user.name,
        donations: 0,
        blood: user.blood || "Unknown",
        image: user.image,
        rank: index + 1,
        createdAt: user.createdAt,
      }));

      return res.status(200).json({ donors: newDonors });
    }

    return res.status(200).json({ donors });
  } catch (error) {
    console.error("Error fetching top donors:", error);
    return res.status(500).json({
      message: "Failed to fetch top donors",
    });
  }
};
export const BloodDonorController = {
  getAllBloodDonors,
  getBloodDonorById,
  createBloodDonor,
  updateBloodDonor,
  deleteBloodDonor,
  getBloodDonorUserId,
  getTopDonors,
};
