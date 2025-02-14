import { PrismaClient, type Donation } from "@prisma/client"
import type { IDonation, IDonationFilters } from "./donation.interface"
import { paginationHelpers } from "../../helpers/paginationHelper"
import type { IGenericResponse } from "../../interfaces/common"
import type { IPaginationOptions } from "../../interfaces/pagination"

const prisma = new PrismaClient()

const getAllDonations = async (
  filters: IDonationFilters,
  paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<Donation[]>> => {
  const { searchTerm, userId, startDate, endDate } = filters
  const { page, limit, skip, sortBy, sortOrder } = paginationHelpers.calculatePagination(paginationOptions)

  const andConditions = []

  if (searchTerm) {
    andConditions.push({
      OR: ["location"].map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    })
  }

  if (userId) {
    andConditions.push({ userId: userId })
  }

  if (startDate && endDate) {
    andConditions.push({
      date: {
        gte: startDate,
        lte: endDate,
      },
    })
  }

  const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {}

  const result = await prisma.donation.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  })

  const total = await prisma.donation.count({ where: whereConditions })

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  }
}

const createDonation = async (donationData: IDonation): Promise<Donation> => {
  const result = await prisma.donation.create({
    data: donationData,
  })
  return result
}

const updateDonation = async (id: string, payload: Partial<IDonation>): Promise<Donation> => {
  const result = await prisma.donation.update({
    where: {
      id,
    },
    data: payload,
  })
  return result
}

const deleteDonation = async (id: string): Promise<Donation> => {
  const result = await prisma.donation.delete({
    where: {
      id,
    },
  })
  return result
}

export const DonationService = {
  getAllDonations,
  createDonation,
  updateDonation,
  deleteDonation,
}

