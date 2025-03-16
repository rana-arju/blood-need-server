"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthRecordRoutes = void 0;
const express_1 = __importDefault(require("express"));
const healthRecord_controller_1 = require("./healthRecord.controller");
const validationRequest_1 = __importDefault(require("../../middlewares/validationRequest"));
const healthRecord_validation_1 = require("./healthRecord.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
// Admin routes
router.get("/", (0, auth_1.default)("admin", "superadmin"), healthRecord_controller_1.HealthRecordController.getAllHealthRecords);
// User routes
router.get("/my-records", (0, auth_1.default)("user", "admin", "superadmin", "volunteer"), healthRecord_controller_1.HealthRecordController.getMyHealthRecords);
router.get("/user/:userId", (0, auth_1.default)("admin", "superadmin"), healthRecord_controller_1.HealthRecordController.getHealthRecordsByUserId);
router.get("/:id", (0, auth_1.default)("user", "admin", "superadmin", "volunteer"), healthRecord_controller_1.HealthRecordController.getHealthRecordById);
router.post("/", (0, auth_1.default)("user", "admin", "superadmin", "volunteer"), (0, validationRequest_1.default)(healthRecord_validation_1.createHealthRecordZodSchema), healthRecord_controller_1.HealthRecordController.createHealthRecord);
router.patch("/:id", (0, auth_1.default)("user", "admin", "superadmin", "volunteer"), (0, validationRequest_1.default)(healthRecord_validation_1.updateHealthRecordZodSchema), healthRecord_controller_1.HealthRecordController.updateHealthRecord);
router.delete("/:id", (0, auth_1.default)("user", "admin", "superadmin", "volunteer"), healthRecord_controller_1.HealthRecordController.deleteHealthRecord);
exports.HealthRecordRoutes = router;
