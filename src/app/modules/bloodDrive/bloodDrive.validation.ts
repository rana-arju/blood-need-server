import { z } from "zod";

export const createBloodDriveZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Name is required",
    }),
    organizer: z.string({
      required_error: "Organizer is required",
    }),
    location: z.string({
      required_error: "Location is required",
    }),
    date: z
      .string({
        required_error: "Date is required",
      })
      .transform((str) => new Date(str)),
    startTime: z.string({
      required_error: "Start time is required",
    }),
    endTime: z.string({
      required_error: "End time is required",
    }),
    description: z.string({
      required_error: "Description is required",
    }),
  }),
});

export const updateBloodDriveZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    organizer: z.string().optional(),
    location: z.string().optional(),
    date: z
      .string()
      .transform((str) => new Date(str))
      .optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    description: z.string().optional(),
  }),
});
