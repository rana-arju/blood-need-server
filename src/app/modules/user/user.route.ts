import express from "express";
import { UserController } from "./user.controller";
import { createUserZodSchema } from "./user.validation";
import validationRequest from "../../middlewares/validationRequest";
import auth from "../../middlewares/auth";

const router = express.Router();

// 🔹 Public Routes (No Authentication Required)
router.post(
  "/register",
  validationRequest(createUserZodSchema),
  UserController.createUser
);
router.post("/login", UserController.login);

// 🔹 Admin Routes (Require Admin Role)
router.get("/users", auth("admin"), UserController.getAllUsers);

// 🔹 User Routes (Require Authentication)
router.get(
  "/user/:id",
  auth("user", "admin", "superadmin", "volunteer"),
  UserController.singleUser
);
router.patch(
  "/user/:id",
  auth("user", "admin", "superadmin", "volunteer"),
  UserController.updateUser
);
router.patch(
  "/password/:id",
  auth("user", "admin", "superadmin", "volunteer"),
  UserController.updatePassword
);
router.delete(
  "/user/:id",
  auth("user", "admin", "superadmin", "volunteer"),
  UserController.deleteUser
);

// 🔹 Admin + Volunteer Routes (Extended Access)
router.get(
  "/user/details/:id",
  auth("admin", "superadmin", "volunteer"),
  UserController.getUserById
);

export const UserRoutes = router;
