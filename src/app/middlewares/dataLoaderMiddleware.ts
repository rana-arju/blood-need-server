import type { Request, Response, NextFunction } from "express";
import { createLoaders } from "../shared/dataloader";

// Extend Express Request interface to include loaders property
declare global {
  namespace Express {
    interface Request {
      loaders?: any;
    }
  }
}

export const dataLoaderMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Create new loaders for each request
  req.loaders = createLoaders();
  next();
};
