import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import config from "../config";

import { IErrorSources, IGenericErrorResponse } from "../interface/error";
import handleZodError from "../error/handleZodError";
import AppError from "../error/AppError";
import logger from "../shared/logger";

export const globalErrorHandler: ErrorRequestHandler = (
  error,
  req,
  res,
  next
) => {
  logger.error(`🐱‍🏍 globalErrorHandler ~~`, error);

  let statusCode = 500;
  let message = "Something went wrong!";
  let errorMessages: IErrorSources = [
    {
      path: "",
      message: "Something went wrong!",
    },
  ];

  if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError?.errorMessages.map((err) => ({
      path: err.path,
      message: err.message,
    }));
  } else if (error instanceof AppError) {
    statusCode = error?.statusCode;
    message = error.message;
    errorMessages = error?.message
      ? [
          {
            path: "",
            message: error?.message,
          },
        ]
      : [];
  } else if (error instanceof Error) {
    message = error?.message;
    errorMessages = error?.message
      ? [
          {
            path: "",
            message: error?.message,
          },
        ]
      : [];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: config.env !== "production" ? error?.stack : undefined,
  });
};
