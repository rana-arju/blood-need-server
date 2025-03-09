import express from "express";
import { BlogController } from "./blog.controller";
import validationRequest from "../../middlewares/validationRequest";
import { createBlogZodSchema, updateBlogZodSchema } from "./blog.validation";
import auth from "../../middlewares/auth";

const router = express.Router();

router.get("/", BlogController.getAllReviews);
router.get("/:id", BlogController.getReviewById);
router.post(
  "/",
  auth("admin", "superadmin", "volunteer"),

  validationRequest(createBlogZodSchema),
  BlogController.createReview
);
router.patch(
  "/:id",
  auth("user", "admin", "superadmin", "volunteer"),

  validationRequest(updateBlogZodSchema),
  BlogController.updateReview
);
router.delete(
  "/:id",
  auth("user", "admin", "superadmin", "volunteer"),
  BlogController.deleteReview
);

export const BlogRoutes = router;
