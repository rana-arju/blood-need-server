import { z } from "zod"
import { ObjectId } from "bson"

export const createBlogZodSchema = z.object({
  body: z.object({
    title: z
      .string({
        required_error: "Title is required",
      })
      .min(3, "Title must be at least 3 characters"),
    content: z
      .string({
        required_error: "Content is required",
      })
      .min(10, "Content must be at least 10 characters"),
    image: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
})

export const updateBlogZodSchema = z.object({
  body: z.object({
    title: z.string().min(3, "Title must be at least 3 characters").optional(),
    content: z.string().min(10, "Content must be at least 10 characters").optional(),
    image: z.string().optional(),
    tags: z.array(z.string()).optional(),
   
  }),
})

export const blogIdSchema = z.object({
  params: z.object({
    id: z.string().refine((val) => ObjectId.isValid(val), {
      message: "Invalid blog ID format",
    }),
  }),
})

