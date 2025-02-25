import { IGenericErrorResponse } from "../interface/error";
declare const handleZodError: (error: ZodError) => IGenericErrorResponse;
export default handleZodError;
