"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BloodDriveRoutes = void 0;
const express_1 = __importDefault(require("express"));
const bloodDrive_controller_1 = require("./bloodDrive.controller");
const bloodDrive_validation_1 = require("./bloodDrive.validation");
const validationRequest_1 = __importDefault(require("../../middlewares/validationRequest"));
const router = express_1.default.Router();
router.get("/", bloodDrive_controller_1.BloodDriveController.getAllBloodDrives);
router.get("/:id", bloodDrive_controller_1.BloodDriveController.getBloodDriveById);
router.post("/", (0, validationRequest_1.default)(bloodDrive_validation_1.createBloodDriveZodSchema), bloodDrive_controller_1.BloodDriveController.createBloodDrive);
router.patch("/:id", (0, validationRequest_1.default)(bloodDrive_validation_1.updateBloodDriveZodSchema), bloodDrive_controller_1.BloodDriveController.updateBloodDrive);
router.delete("/:id", bloodDrive_controller_1.BloodDriveController.deleteBloodDrive);
exports.BloodDriveRoutes = router;
