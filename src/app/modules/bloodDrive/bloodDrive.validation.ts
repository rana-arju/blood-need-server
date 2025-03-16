import { z } from "zod";

export const createBloodDriveZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: "Title is required",
    }),
    organizer: z.string({
      required_error: "Organizer is required",
    }),
    address: z.string({
      required_error: "Address is required",
    }),
    division: z.string({
      required_error: "Division is required",
    }),
    district: z.string({
      required_error: "District is required",
    }),
    upazila: z.string({
      required_error: "Upazila is required",
    }),
    date: z
      .string({
        required_error: "Date is required",
      })
      .transform((str) => new Date(str)),
   
    banner: z.string({
      required_error: "banner is required",
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
