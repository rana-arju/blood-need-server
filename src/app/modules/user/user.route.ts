import express from "express";
import { UserController } from "./user.controller";
import { createUserZodSchema } from "./user.validation";
import validationRequest from "../../middlewares/validationRequest";
import auth from "../../middlewares/auth";

const router = express.Router();

router.get("/users", UserController.getAllUsers);
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

export const UserRoutes = router;
