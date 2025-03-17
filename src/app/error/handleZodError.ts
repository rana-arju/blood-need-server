import { ZodError } from "zod";
import { IErrorSources, IGenericErrorResponse } from "../interface/error";

const handleZodError = (error: ZodError): IGenericErrorResponse => {
  const errorMessages: IErrorSources = error.issues.map((issue) => ({
    path: issue.path[issue.path.length - 1],
    message: issue.message,
  }));

  const statusCode = 400;
  return {
    statusCode,
    message: "Validation error",
    errorMessages,
  };
};

export default handleZodError;
