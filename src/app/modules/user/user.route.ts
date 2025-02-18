import express from "express"
import { UserController } from "./user.controller"
import { createUserZodSchema, updateUserZodSchema } from "./user.validation"
import validationRequest from "../../middlewares/validationRequest"

const router = express.Router()

router.get("/users", UserController.getAllUsers)
router.post(
  "/register",
  validationRequest(createUserZodSchema),
  UserController.createUser
);
router.post(
  "/login",
  UserController.login
);
router.patch(
  "/user/:id",
  validationRequest(updateUserZodSchema),
  UserController.updateUser
);
router.delete("/user/:id", UserController.deleteUser)

export const UserRoutes = router

