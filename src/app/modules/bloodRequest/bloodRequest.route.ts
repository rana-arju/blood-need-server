import express from "express";
import { BloodRequestController } from "./bloodRequest.controller";

import validationRequest from "../../middlewares/validationRequest";
import { createBloodRequestZodSchema, updateBloodRequestZodSchema } from "./bloodRequest.validation";
import auth from "../../middlewares/auth";

const router = express.Router();

router.get("/", BloodRequestController.getAllBloodRequests);
router.get(
  "/:id",
  BloodRequestController.getBloodRequestById
);
router.post(
  "/", auth("user", "admin", "superadmin", "volunteer"),
  validationRequest(createBloodRequestZodSchema),
  BloodRequestController.createBloodRequest
);
router.patch(
  "/:id",
  auth("user", "admin", "superadmin", "volunteer"),
  validationRequest(updateBloodRequestZodSchema),
  BloodRequestController.updateBloodRequest
);
router.delete(
  "/:id",
  auth("user", "admin", "superadmin", "volunteer"),
  BloodRequestController.deleteBloodRequest
);

export const BloodRequestRoutes = router;
