import { z } from "zod";

export const createBloodDonorZodSchema = z.object({
  body: z.object({
    userId: z.string({
      required_error: "User ID is required",
    }),
    whatsappNumber: z.string({
      required_error: "whatsappNumber is required",
    }),
    facebookId: z.string({
      required_error: "facebookId is required",
    }),
    emergencyContact: z.string({
      required_error: "Emergency Contact is required",
    }),
    lastDonationDate: z
      .string()
      .transform((str) => new Date(str))
      .optional(),
    totalDonations: z.number().int().nonnegative().default(0),
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
