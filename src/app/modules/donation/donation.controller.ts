import type { Request, Response } from "express"
import { DonationService } from "./donation.service"
import catchAsync from "../../shared/catchAsync"
import sendResponse from "../../shared/sendResponse"
import pick from "../../shared/pick"
import { donationFilterableFields } from "./donation.constant"
import { paginationFields } from "../../constants/pagination"

const getAllDonations = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, donationFilterableFields)
  const paginationOptions = pick(req.query, paginationFields)

  const result = await DonationService.getAllDonations(filters, paginationOptions)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Donations retrieved successfully",
    meta: result.meta,
    data: result.data,
  })
})

const createDonation = catchAsync(async (req: Request, res: Response) => {
  const result = await DonationService.createDonation(req.body)
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Donation created successfully",
    data: result,
  })
})

const updateDonation = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await DonationService.updateDonation(id, req.body)
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Donation updated successfully",
    data: result,
  })
})

const deleteDonation = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await DonationService.deleteDonation(id)
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Donation deleted successfully",
    data: result,
  })
})

export const DonationController = {
  getAllDonations,
  createDonation,
  updateDonation,
  deleteDonation,
}

