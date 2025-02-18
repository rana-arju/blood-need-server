import { z } from "zod";

export const createVolunteerZodSchema = z.object({
  body: z.object({
    userId: z.string({
      required_error: "User ID is required",
    }),
    skills: z.array(z.string()).nonempty({
      message: "At least one skill is required",
    }),
    availability: z.string({
      required_error: "Availability is required",
    }),
    experience: z.string({
      required_error: "Experience is required",
    }),
  }),
});

export const updateVolunteerZodSchema = z.object({
  body: z.object({
    skills: z.array(z.string()).optional(),
    availability: z.string().optional(),
    experience: z.string().optional(),
  }),
});
