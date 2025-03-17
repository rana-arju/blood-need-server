import type { Request, Response, NextFunction } from "express";
import { createLoaders } from "../shared/dataloader";

// Extend Express Request interface to include loaders property
declare global {
  namespace Express {
    interface Request {
      loaders?: ReturnType<typeof createLoaders>;
    }
  }
}

export const dataLoaderMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Create new loaders for each request
    req.loaders = createLoaders();
    next();
  } catch (error) {
    console.error("Error creating dataloaders:", error);
    // Continue without loaders if there's an error
    next();
  }
};
