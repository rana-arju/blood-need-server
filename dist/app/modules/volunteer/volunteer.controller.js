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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VolunteerController = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const volunteer_service_1 = require("./volunteer.service");
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
const getVolunteerById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield volunteer_service_1.VolunteerService.getVolunteerById(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Volunteer retrieved successfully",
        data: result,
    });
}));
const createVolunteer = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield volunteer_service_1.VolunteerService.createVolunteer(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Volunteer created successfully",
        data: result,
    });
}));
const updateVolunteer = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield volunteer_service_1.VolunteerService.updateVolunteer(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Volunteer updated successfully",
        data: result,
    });
}));
const deleteVolunteer = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield volunteer_service_1.VolunteerService.deleteVolunteer(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Volunteer deleted successfully",
        data: result,
    });
}));
exports.VolunteerController = {
    getVolunteerById,
    createVolunteer,
    updateVolunteer,
    deleteVolunteer,
};
