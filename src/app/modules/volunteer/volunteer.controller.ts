import type { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";

import { VolunteerService } from "./volunteer.service";
/*
const getAllVolunteers = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, volunteerFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await VolunteerService.getAllVolunteers(
    filters,
    paginationOptions
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Volunteers retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});
*/
const getVolunteerById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await VolunteerService.getVolunteerById(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Volunteer retrieved successfully",
    data: result,
  });
});

const createVolunteer = catchAsync(async (req: Request, res: Response) => {
  const result = await VolunteerService.createVolunteer(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Volunteer created successfully",
    data: result,
  });
});

const updateVolunteer = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await VolunteerService.updateVolunteer(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Volunteer updated successfully",
    data: result,
  });
});

const deleteVolunteer = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await VolunteerService.deleteVolunteer(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Volunteer deleted successfully",
    data: result,
  });
});

export const VolunteerController = {
  getVolunteerById,
  createVolunteer,
  updateVolunteer,
  deleteVolunteer,
};
