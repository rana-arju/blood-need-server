import type { ZodError } from "zod";
import type { IGenericErrorResponse } from "../interface/error";

const handleZodError = (error: ZodError): IGenericErrorResponse => {
  const errorMessages = error.errors.map((err) => {
    return {
      path: err.path.join("."),
      message: err.message,
    };
  });

  return {
    statusCode: 400,
    message: "Validation Error",
    errorMessages,
  };
};

export default handleZodError;
