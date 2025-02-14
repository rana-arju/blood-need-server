import { IErrorSources, IGenericErrorResponse } from "../interface/error";

const handleCastError = (
  err: 
    {
      path: "";
      message: "";
    }
  
): IGenericErrorResponse => {
  const errorMessages: IErrorSources = [
    {
      path: err.path,
      message: err?.message,
    },
  ];

  const statusCode = 400;
  return {
    statusCode,
    message: "Cast error",
    errorMessages,
  };
};

export default handleCastError;
