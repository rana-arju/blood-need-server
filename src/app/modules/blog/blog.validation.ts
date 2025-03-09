import { z } from "zod";

export const createBlogZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: "Title is required",
    }),
    content: z.string({
      required_error: "Content is required",
    }),
    image: z.string({
      required_error: "Content is required",
    }),
  }),
});

export const updateBlogZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: "Title is required",
    }),
    content: z.string({
      required_error: "Content is required",
    }),
    image: z.string({
      required_error: "Content is required",
    }),
  }),
});
