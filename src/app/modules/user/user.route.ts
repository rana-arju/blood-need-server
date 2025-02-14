import express from "express"
import { UserController } from "./user.controller"
import { createUserZodSchema, updateUserZodSchema } from "./user.validation"
import validationRequest from "../../middlewares/validationRequest"

const router = express.Router()

router.get("/", UserController.getAllUsers)
router.post(
  "/",
  validationRequest(createUserZodSchema),
  UserController.createUser
);
router.patch(
  "/:id",
  validationRequest(updateUserZodSchema),
  UserController.updateUser
);
router.delete("/:id", UserController.deleteUser)

export const UserRoutes = router

