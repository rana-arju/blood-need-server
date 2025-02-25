"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BloodDonorRoutes = void 0;
const express_1 = __importDefault(require("express"));
const bloodDonor_controller_1 = require("./bloodDonor.controller");
const bloodDonor_validation_1 = require("./bloodDonor.validation");
const validationRequest_1 = __importDefault(require("../../middlewares/validationRequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
router.get("/", bloodDonor_controller_1.BloodDonorController.getAllBloodDonors);
router.post("/", (0, auth_1.default)("user", "admin", "superadmin", "volunteer"), (0, validationRequest_1.default)(bloodDonor_validation_1.createBloodDonorZodSchema), bloodDonor_controller_1.BloodDonorController.createBloodDonor);
router.get("/:id", bloodDonor_controller_1.BloodDonorController.getBloodDonorById);
router.patch("/:id", (0, auth_1.default)("user", "admin", "superadmin", "volunteer"), (0, validationRequest_1.default)(bloodDonor_validation_1.updateBloodDonorZodSchema), bloodDonor_controller_1.BloodDonorController.updateBloodDonor);
router.delete("/:id", (0, auth_1.default)("admin", "superadmin", "volunteer"), bloodDonor_controller_1.BloodDonorController.deleteBloodDonor);
exports.BloodDonorRoutes = router;
