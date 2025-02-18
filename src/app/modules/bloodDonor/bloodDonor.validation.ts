import { z } from "zod";

export const createBloodDonorZodSchema = z.object({
  body: z.object({
    userId: z.string({
      required_error: "User ID is required",
    }),
    lastDonationDate: z
      .string({
        required_error: "Last donation date is required",
      })
      .transform((str) => new Date(str)),
    totalDonations: z
      .number({
        required_error: "Total donations is required",
      })
      .int()
      .nonnegative(),
    eligibleToDonateSince: z
      .string({
        required_error: "Eligible to donate since date is required",
      })
      .transform((str) => new Date(str)),
  }),
});

export const updateBloodDonorZodSchema = z.object({
  body: z.object({
    lastDonationDate: z
      .string()
      .transform((str) => new Date(str))
      .optional(),
    totalDonations: z.number().int().nonnegative().optional(),
    eligibleToDonateSince: z
      .string()
      .transform((str) => new Date(str))
      .optional(),
  }),
});
