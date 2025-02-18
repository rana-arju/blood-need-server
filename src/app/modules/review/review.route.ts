import express from "express";
import { ReviewController } from "./review.controller";
import validationRequest from "../../middlewares/validationRequest";
import { createReviewZodSchema, updateReviewZodSchema } from "./review.validation";


const router = express.Router();

router.get("/", ReviewController.getAllReviews);
router.get("/:id", ReviewController.getReviewById);
router.post(
  "/",
  validationRequest(createReviewZodSchema),
  ReviewController.createReview
);
router.patch(
  "/:id",
  validationRequest(updateReviewZodSchema),
  ReviewController.updateReview
);
router.delete("/:id", ReviewController.deleteReview);

export const ReviewRoutes = router;
