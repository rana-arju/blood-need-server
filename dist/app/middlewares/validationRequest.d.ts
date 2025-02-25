/// <reference types="qs" />
import { NextFunction, Request, Response } from "express";
declare const validationRequest: (schema: AnyZodObject) => (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, next: NextFunction) => Promise<void>;
export default validationRequest;
