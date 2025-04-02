"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const user_validation_1 = require("./user.validation");
const validationRequest_1 = __importDefault(require("../../middlewares/validationRequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const checkMissedNotifications_1 = require("../../middlewares/checkMissedNotifications");
const router = express_1.default.Router();
// 🔹 Public Routes (No Authentication Required)
router.post("/register", (0, validationRequest_1.default)(user_validation_1.createUserZodSchema), user_controller_1.UserController.createUser);
router.post("/login", user_controller_1.UserController.login);
// 🔹 Admin Routes (Require Admin Role)
router.get("/users", (0, auth_1.default)("admin"), user_controller_1.UserController.getAllUsers);
// Protected routes
router.get("/me", (0, auth_1.default)("user", "admin", "superadmin", "volunteer"), checkMissedNotifications_1.checkMissedNotifications, // Add middleware to check missed notifications on login
user_controller_1.UserController.getMe);
// 🔹 User Routes (Require Authentication)
router.get("/user/:id", (0, auth_1.default)("user", "admin", "superadmin", "volunteer"), user_controller_1.UserController.singleUser);
router.patch("/user/:id", (0, auth_1.default)("user", "admin", "superadmin", "volunteer"), user_controller_1.UserController.updateUser);
router.patch("/password/:id", (0, auth_1.default)("user", "admin", "superadmin", "volunteer"), user_controller_1.UserController.updatePassword);
router.delete("/user/:id", (0, auth_1.default)("user", "admin", "superadmin", "volunteer"), user_controller_1.UserController.deleteUser);
// 🔹 Admin + Volunteer Routes (Extended Access)
router.get("/user/details/:id", (0, auth_1.default)("admin", "superadmin", "volunteer"), user_controller_1.UserController.getUserById);
exports.UserRoutes = router;
