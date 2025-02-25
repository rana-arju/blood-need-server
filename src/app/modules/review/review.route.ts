import express from "express";
import { ReviewController } from "./review.controller";
import validationRequest from "../../middlewares/validationRequest";
import {
  createReviewZodSchema,
  updateReviewZodSchema,
} from "./review.validation";
import auth from "../../middlewares/auth";

const router = express.Router();

router.get("/", ReviewController.getAllReviews);
router.get("/:id", ReviewController.getReviewById);
router.post(
  "/",
  auth("user", "admin", "superadmin", "volunteer"),

  validationRequest(createReviewZodSchema),
  ReviewController.createReview
);
router.patch(
  "/:id",
  auth("user", "admin", "superadmin", "volunteer"),

  validationRequest(updateReviewZodSchema),
  ReviewController.updateReview
);
router.delete(
  "/:id",
  auth("user", "admin", "superadmin", "volunteer"),
  ReviewController.deleteReview
);

export const ReviewRoutes = router;
