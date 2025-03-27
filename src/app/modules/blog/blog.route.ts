import express from "express"
import { BlogController } from "./blog.controller"
import { createBlogZodSchema, updateBlogZodSchema } from "./blog.validation"
import auth from "../../middlewares/auth"
import validationRequest from "../../middlewares/validationRequest"
const router = express.Router()

// Public routes
router.get("/", BlogController.getAllBlogs)
router.get("/:id", BlogController.getBlogById)

// Protected routes
router.post(
  "/",
  auth("user", "admin", "superadmin", "volunteer"),
  validationRequest(createBlogZodSchema),
  BlogController.createBlog,
)

router.patch(
  "/:id",
  auth("user", "admin", "superadmin", "volunteer"),
  validationRequest(updateBlogZodSchema),
  BlogController.updateBlog,
)

router.delete(
  "/:id",
  auth("user", "admin", "superadmin", "volunteer"),
  BlogController.deleteBlog,
)

export const BlogRoutes = router

