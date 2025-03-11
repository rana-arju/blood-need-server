import express from "express";
import { UserController } from "./user.controller";
import { createUserZodSchema } from "./user.validation";
import validationRequest from "../../middlewares/validationRequest";
import auth from "../../middlewares/auth";

const router = express.Router();

router.get("/users",auth("admin"), UserController.getAllUsers);
router.post(
  "/register",
  validationRequest(createUserZodSchema),
  UserController.createUser
);
router.post("/login", UserController.login);
router.patch(
  "/user/:id",
  auth("user", "admin", "superadmin", "volunteer"),
  UserController.updateUser
);
router.delete(
  "/user/:id",
  auth("user", "admin", "superadmin", "volunteer"),
  UserController.deleteUser
);
router.get(
  "/user/:id",
  auth("user", "admin", "superadmin", "volunteer"),
  UserController.singleUser
);
router.get(
  "/user/:id",
  auth( "admin", "superadmin", "volunteer"),
  UserController.getUserById
);

export const UserRoutes = router;
