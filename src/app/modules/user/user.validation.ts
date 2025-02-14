import { z } from "zod"

export const createUserZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Name is required",
    }),
    email: z
      .string({
        required_error: "Email is required",
      })
      .email(),
    bloodType: z.string({
      required_error: "Blood type is required",
    }),
  }),
})

export const updateUserZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    bloodType: z.string().optional(),
  }),
})

