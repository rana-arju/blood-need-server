import { Response } from 'express';
type IApiResponse<T> = {
    statusCode: number;
    success: boolean;
    message?: string | null;
    meta?: {
        page: number;
        limit: number;
        total: number;
    } | null;
    data?: T | null;
};
declare const sendResponse: <T>(res: Response, data: IApiResponse<T>) => void;
export default sendResponse;
