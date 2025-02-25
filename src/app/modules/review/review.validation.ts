import { z } from "zod";

export const createReviewZodSchema = z.object({
  body: z.object({
    comment: z.string({
      required_error: "Comment is required",
    }),
  }),
});

export const updateReviewZodSchema = z.object({
  body: z.object({
    comment: z.string(),
  }),
});
