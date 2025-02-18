import express from "express";
import { BloodDonorController } from "./bloodDonor.controller";
import {
  createBloodDonorZodSchema,
  updateBloodDonorZodSchema,
} from "./bloodDonor.validation";
import validationRequest from "../../middlewares/validationRequest";

const router = express.Router();

router.get("/", BloodDonorController.getAllBloodDonors);
router.post(
  "/",
  validationRequest(createBloodDonorZodSchema),
  BloodDonorController.createBloodDonor
);
router.get("/:id", BloodDonorController.getBloodDonorById);
router.patch(
  "/:id",
  validationRequest(updateBloodDonorZodSchema),
  BloodDonorController.updateBloodDonor
);
router.delete("/:id", BloodDonorController.deleteBloodDonor);

export const BloodDonorRoutes = router;
