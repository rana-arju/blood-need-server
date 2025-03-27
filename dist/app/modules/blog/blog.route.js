"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogRoutes = void 0;
const express_1 = __importDefault(require("express"));
const blog_controller_1 = require("./blog.controller");
const blog_validation_1 = require("./blog.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validationRequest_1 = __importDefault(require("../../middlewares/validationRequest"));
const router = express_1.default.Router();
// Public routes
router.get("/", blog_controller_1.BlogController.getAllBlogs);
router.get("/:id", blog_controller_1.BlogController.getBlogById);
// Protected routes
router.post("/", (0, auth_1.default)("user", "admin", "superadmin", "volunteer"), (0, validationRequest_1.default)(blog_validation_1.createBlogZodSchema), blog_controller_1.BlogController.createBlog);
router.patch("/:id", (0, auth_1.default)("user", "admin", "superadmin", "volunteer"), (0, validationRequest_1.default)(blog_validation_1.updateBlogZodSchema), blog_controller_1.BlogController.updateBlog);
router.delete("/:id", (0, auth_1.default)("user", "admin", "superadmin", "volunteer"), blog_controller_1.BlogController.deleteBlog);
exports.BlogRoutes = router;
