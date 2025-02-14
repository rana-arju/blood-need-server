import { IErrorSources, IGenericErrorResponse } from "../interface/error";

const handleValidationError = (
  err: [
    {
      path: "";
      message: "";
    }
  ]
): IGenericErrorResponse => {
  const errorMessages: IErrorSources = Object.values(err).map((val) => {
    return {
      path: val?.path,
      message: val?.message,
    };
  });

  const statusCode = 400;
  return {
    statusCode,
    message: "validation error",
    errorMessages,
  };
};

export default handleValidationError;
