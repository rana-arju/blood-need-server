import { z } from "zod";

export const createReviewZodSchema = z.object({
  body: z.object({
    userId: z.string({
      required_error: "User ID is required",
    }),
    rating: z
      .number({
        required_error: "Rating is required",
      })
      .min(1)
      .max(5),
    comment: z.string({
      required_error: "Comment is required",
    }),
  }),
});

export const updateReviewZodSchema = z.object({
  body: z.object({
    rating: z.number().min(1).max(5).optional(),
    comment: z.string().optional(),
  }),
});
