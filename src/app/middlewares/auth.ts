import { NextFunction, Request, Response } from "express";
type IUserRole = "user" | "admin" | "superadmin" | "volunteer"; // Define user roles


declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: string;
      role: IUserRole;
      email: string;
    };
  }
}
import prisma from "../shared/prisma"; // Prisma instance for MongoDB
import AppError from "../error/AppError";
// Auth middleware for checking userId and user roles
const auth = (...requiredRoles: IUserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    
    const userId = req.headers.authorization?.split(" ")[1]; // Get userId from "Bearer <userId>"

    if (!userId) {
      return next(new AppError(401, "You are unauthorized to access"));
    }

    // Fetch user from MongoDB using Prisma based on the userId passed in the token
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return next(new AppError(404, "User not found"));
    }

    // Check if the user is blocked
    if (user.status === "blocked") {
      return next(new AppError(403, "User is blocked"));
    }

    // Check for role-based access control
    if (
      requiredRoles.length &&
      !requiredRoles.includes(user.role as IUserRole)
    ) {
      return next(
        new AppError(403, "You are not authorized to access this resource")
      );
    }
    req.user = { id: user.id, role: user?.role as IUserRole, email: user?.email}; // Set user in the request object
    next();
  };
};

export default auth;
