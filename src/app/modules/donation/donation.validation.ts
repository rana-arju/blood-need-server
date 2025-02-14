import { z } from "zod"

export const createDonationZodSchema = z.object({
  body: z.object({
    userId: z.string({
      required_error: "User ID is required",
    }),
    date: z
      .string({
        required_error: "Date is required",
      })
      .transform((str) => new Date(str)),
    amount: z
      .number({
        required_error: "Amount is required",
      })
      .positive(),
    location: z.string({
      required_error: "Location is required",
    }),
  }),
})

export const updateDonationZodSchema = z.object({
  body: z.object({
    date: z
      .string()
      .transform((str) => new Date(str))
      .optional(),
    amount: z.number().positive().optional(),
    location: z.string().optional(),
  }),
})

