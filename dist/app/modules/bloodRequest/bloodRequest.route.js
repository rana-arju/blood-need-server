"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BloodRequestRoutes = void 0;
const express_1 = __importDefault(require("express"));
const bloodRequest_controller_1 = require("./bloodRequest.controller");
const validationRequest_1 = __importDefault(require("../../middlewares/validationRequest"));
const bloodRequest_validation_1 = require("./bloodRequest.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
router.get("/", bloodRequest_controller_1.BloodRequestController.getAllBloodRequests);
router.get("/myrequest", (0, auth_1.default)("admin", "user", "superadmin", "volunteer"), bloodRequest_controller_1.BloodRequestController.getAllMyBloodRequests);
router.get("/:id", bloodRequest_controller_1.BloodRequestController.getBloodRequestById);
router.post("/", (0, auth_1.default)("user", "admin", "superadmin", "volunteer"), (0, validationRequest_1.default)(bloodRequest_validation_1.createBloodRequestZodSchema), bloodRequest_controller_1.BloodRequestController.createBloodRequest);
router.patch("/:id", (0, auth_1.default)("user", "admin", "superadmin", "volunteer"), (0, validationRequest_1.default)(bloodRequest_validation_1.updateBloodRequestZodSchema), bloodRequest_controller_1.BloodRequestController.updateBloodRequest);
router.delete("/:id", (0, auth_1.default)("user", "admin", "superadmin", "volunteer"), bloodRequest_controller_1.BloodRequestController.deleteBloodRequest);
exports.BloodRequestRoutes = router;
