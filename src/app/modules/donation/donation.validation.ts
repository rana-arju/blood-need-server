import { z } from "zod";
import { ObjectId } from "bson";

export const createDonationOfferZodSchema = z.object({
  body: z.object({
    bloodRequestId: z.string().refine((val) => ObjectId.isValid(val), {
      message: "Invalid bloodRequestId format",
    }),
  }),
});


export const updateDonationOfferZodSchema = z.object({
  body: z.object({
    status: z.enum(["pending", "accepted", "rejected", "completed"]).optional(),
    message: z.string().optional(),
  }),
});

export const updateDonorStatusZodSchema = z.object({
  body: z.object({
    status: z.enum(["pending", "selected", "confirmed", "cancelled"]),
  }),
});