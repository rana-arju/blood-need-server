import { IGenericErrorResponse } from "../interface/error";
declare const handleValidationError: (err: [
    {
        path: "";
        message: "";
    }
]) => IGenericErrorResponse;
export default handleValidationError;
