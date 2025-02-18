import express from "express";
import { BloodRequestController } from "./bloodRequest.controller";

import validationRequest from "../../middlewares/validationRequest";
import { createBloodRequestZodSchema, updateBloodRequestZodSchema } from "./bloodRequest.validation";

const router = express.Router();

router.get("/", BloodRequestController.getAllBloodRequests);
router.get("/:id", BloodRequestController.getBloodRequestById);
router.post(
  "/",
  validationRequest(createBloodRequestZodSchema),
  BloodRequestController.createBloodRequest
);
router.patch(
  "/:id",
  validationRequest(updateBloodRequestZodSchema),
  BloodRequestController.updateBloodRequest
);
router.delete("/:id", BloodRequestController.deleteBloodRequest);

export const BloodRequestRoutes = router;
