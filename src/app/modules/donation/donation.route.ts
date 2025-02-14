import express from "express";
import { DonationController } from "./donation.controller";
import {
  createDonationZodSchema,
  updateDonationZodSchema,
} from "./donation.validation";
import validationRequest from "../../middlewares/validationRequest";

const router = express.Router();

router.get("/", DonationController.getAllDonations);
router.post(
  "/",
  validationRequest(createDonationZodSchema),
  DonationController.createDonation
);
router.patch(
  "/:id",
  validationRequest(updateDonationZodSchema),
  DonationController.updateDonation
);
router.delete("/:id", DonationController.deleteDonation);

export const DonationRoutes = router;
