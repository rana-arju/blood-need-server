import express from "express";

import validationRequest from "../../middlewares/validationRequest";

import auth from "../../middlewares/auth";
import { DonationController } from "./donation.controller";
import {
  createDonationOfferZodSchema,
 
  updateDonorStatusZodSchema,
} from "./donation.validation";

const router = express.Router();

router.get(
  "/",
  auth("admin", "superadmin", "user", "volunteer"),
  DonationController.getAllDonationOffers
);

router.get(
  "/my-donation",
  auth("user", "admin", "superadmin", "volunteer"),
  DonationController.getMyDonations
);
router.get(
  "/single/:id",
  auth("user", "admin", "superadmin", "volunteer"),
  DonationController.getSingleDonation
);
router.get(
  "/:id",
  auth("user", "admin", "superadmin", "volunteer"),
  DonationController.getMyDonationOffers
);
router.get(
  "/:id",
  auth("user", "admin", "superadmin", "volunteer"),
  DonationController.getSingleDonation
);

router.get(
  "/:id",
  auth("user", "admin", "superadmin", "volunteer"),
  DonationController.getDonationOfferById
);

router.post(
  "/",
  auth("user", "admin", "superadmin", "volunteer"),
  validationRequest(createDonationOfferZodSchema),
  DonationController.createDonationOffer
);

// New routes to match frontend API calls

// Cancel interest in a blood request
router.delete(
  "/blood-requests/:requestId/interest",
  auth("user", "admin", "superadmin", "volunteer"),
  DonationController.cancelInterest
);

// Get interested donor details
router.get(
  "/blood-requests/:requestId/donors/:userId",
  auth("user", "admin", "superadmin", "volunteer"),
  DonationController.getInterestedDonorDetails
);

// Update interested donor status
router.patch(
  "/blood-requests/:requestId/donors/:userId/status",
  auth("user", "admin", "superadmin", "volunteer"),
  validationRequest(updateDonorStatusZodSchema),
  DonationController.updateDonorStatus
);
export const DonationRoutes = router;
