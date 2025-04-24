import express from "express";
import { BlogController } from "./blog.controller";
import { createBlogZodSchema, updateBlogZodSchema } from "./blog.validation";
import auth from "../../middlewares/auth";
import validationRequest from "../../middlewares/validationRequest";
const router = express.Router();

// Public routes
router.get("/", BlogController.getAllBlogs);
router.get("/:id", BlogController.getBlogById);

export const BlogRoutes = router;
