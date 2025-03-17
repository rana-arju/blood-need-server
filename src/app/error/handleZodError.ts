import * as z from "zod";

const handleZodError = (error: z.ZodError) => {
  const errorMessages = error.issues.map((issue) => ({
    path: issue.path.join("."), // Join path array into a string
    message: issue.message,
  }));

  return {
    statusCode: 400,
    message: "Validation error",
    errorMessages,
  };
};

export default handleZodError;
