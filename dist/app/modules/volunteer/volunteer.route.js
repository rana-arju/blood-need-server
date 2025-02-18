"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VolunteerRoutes = void 0;
const express_1 = __importDefault(require("express"));
const volunteer_controller_1 = require("./volunteer.controller");
const validationRequest_1 = __importDefault(require("../../middlewares/validationRequest"));
const volunteer_validation_1 = require("./volunteer.validation");
const router = express_1.default.Router();
//router.get("/", VolunteerController.getAllVolunteers);
router.get("/:id", volunteer_controller_1.VolunteerController.getVolunteerById);
router.post("/", (0, validationRequest_1.default)(volunteer_validation_1.createVolunteerZodSchema), volunteer_controller_1.VolunteerController.createVolunteer);
router.patch("/:id", (0, validationRequest_1.default)(volunteer_validation_1.updateVolunteerZodSchema), volunteer_controller_1.VolunteerController.updateVolunteer);
router.delete("/:id", volunteer_controller_1.VolunteerController.deleteVolunteer);
exports.VolunteerRoutes = router;
