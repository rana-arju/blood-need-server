import express from "express";
import { VolunteerController } from "./volunteer.controller";
import validationRequest from "../../middlewares/validationRequest";
import { createVolunteerZodSchema, updateVolunteerZodSchema } from "./volunteer.validation";


const router = express.Router();

//router.get("/", VolunteerController.getAllVolunteers);
router.get("/:id", VolunteerController.getVolunteerById);
router.post(
  "/",
  validationRequest(createVolunteerZodSchema),
  VolunteerController.createVolunteer
);
router.patch(
  "/:id",
  validationRequest(updateVolunteerZodSchema),
  VolunteerController.updateVolunteer
);
router.delete("/:id", VolunteerController.deleteVolunteer);

export const VolunteerRoutes = router;
