import { IGenericErrorResponse } from "../interface/error";
declare const handleCastError: (err: {
    path: "";
    message: "";
}) => IGenericErrorResponse;
export default handleCastError;
