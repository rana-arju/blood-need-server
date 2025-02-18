import express from "express";
import { BloodDriveController } from "./bloodDrive.controller";
import {
  createBloodDriveZodSchema,
  updateBloodDriveZodSchema,
} from "./bloodDrive.validation";
import validationRequest from "../../middlewares/validationRequest";

const router = express.Router();

router.get("/", BloodDriveController.getAllBloodDrives);
router.get("/:id", BloodDriveController.getBloodDriveById);
router.post(
  "/",
  validationRequest(createBloodDriveZodSchema),
  BloodDriveController.createBloodDrive
);
router.patch(
  "/:id",
  validationRequest(updateBloodDriveZodSchema),
  BloodDriveController.updateBloodDrive
);
router.delete("/:id", BloodDriveController.deleteBloodDrive);

export const BloodDriveRoutes = router;
