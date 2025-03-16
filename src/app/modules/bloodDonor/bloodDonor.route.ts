import express from "express";
import { BloodDonorController } from "./bloodDonor.controller";
import {
  createBloodDonorZodSchema,
  updateBloodDonorZodSchema,
} from "./bloodDonor.validation";
import validationRequest from "../../middlewares/validationRequest";
import auth from "../../middlewares/auth";

const router = express.Router();

// 🟢 Get all blood donors (Public)
router.get("/", BloodDonorController.getAllBloodDonors);

// 🟢 Get blood donor by User ID (Public)
router.get("/user/:id", BloodDonorController.getBloodDonorUserId);

// 🟢 Get blood donor by BloodDonor ID (Public)
router.get("/:id", BloodDonorController.getBloodDonorById);

// 🟠 Create new blood donor (Requires Auth)
router.post(
  "/",
  auth("user", "admin", "superadmin", "volunteer"),
  validationRequest(createBloodDonorZodSchema),
  BloodDonorController.createBloodDonor
);

// 🟠 Update blood donor info (Requires Auth)
router.patch(
  "/:id",
  auth("user", "admin", "superadmin", "volunteer"),
  validationRequest(updateBloodDonorZodSchema),
  BloodDonorController.updateBloodDonor
);

// 🔴 Delete blood donor (Restricted to Admins & Volunteers)
router.delete(
  "/:id",
  auth("admin", "superadmin", "volunteer"),
  BloodDonorController.deleteBloodDonor
);

export const BloodDonorRoutes = router;
