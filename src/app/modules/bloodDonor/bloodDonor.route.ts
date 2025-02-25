import express from "express";
import { BloodDonorController } from "./bloodDonor.controller";
import {
  createBloodDonorZodSchema,
  updateBloodDonorZodSchema,
} from "./bloodDonor.validation";
import validationRequest from "../../middlewares/validationRequest";
import auth from "../../middlewares/auth";

const router = express.Router();

router.get("/", BloodDonorController.getAllBloodDonors);
router.post(
  "/",
  auth("user", "admin", "superadmin", "volunteer"),
  validationRequest(createBloodDonorZodSchema),
  BloodDonorController.createBloodDonor
);
router.get("/:id", BloodDonorController.getBloodDonorById);
router.patch(
  "/:id",
  auth("user", "admin", "superadmin", "volunteer"),

  validationRequest(updateBloodDonorZodSchema),
  BloodDonorController.updateBloodDonor
);
router.delete(
  "/:id",
  auth( "admin", "superadmin", "volunteer"),
  BloodDonorController.deleteBloodDonor
);

export const BloodDonorRoutes = router;
