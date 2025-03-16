import express from "express";
import { HealthRecordController } from "./healthRecord.controller";
import validationRequest from "../../middlewares/validationRequest";
import {
  createHealthRecordZodSchema,
  updateHealthRecordZodSchema,
} from "./healthRecord.validation";
import auth from "../../middlewares/auth";

const router = express.Router();

// Admin routes
router.get(
  "/",
  auth("admin", "superadmin"),
  HealthRecordController.getAllHealthRecords
);

// User routes
router.get(
  "/my-records",
  auth("user", "admin", "superadmin", "volunteer"),
  HealthRecordController.getMyHealthRecords
);

router.get(
  "/user/:userId",
  auth("admin", "superadmin"),
  HealthRecordController.getHealthRecordsByUserId
);

router.get(
  "/:id",
  auth("user", "admin", "superadmin", "volunteer"),
  HealthRecordController.getHealthRecordById
);

router.post(
  "/",
  auth("user", "admin", "superadmin", "volunteer"),
  validationRequest(createHealthRecordZodSchema),
  HealthRecordController.createHealthRecord
);

router.patch(
  "/:id",
  auth("user", "admin", "superadmin", "volunteer"),
  validationRequest(updateHealthRecordZodSchema),
  HealthRecordController.updateHealthRecord
);

router.delete(
  "/:id",
  auth("user", "admin", "superadmin", "volunteer"),
  HealthRecordController.deleteHealthRecord
);

export const HealthRecordRoutes = router;
