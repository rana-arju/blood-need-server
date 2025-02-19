import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../shared/prisma";

// Initialize Prisma Client

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

// Middleware to authenticate the user
export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the token from the Authorization header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    // If token is missing, return an error
    if (!token) {
      throw new Error("No token provided");
    }

    // Decode and verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };

    // Find the user in the database based on the decoded id
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    // If no user is found, return an authentication error
    if (!user) {
      throw new Error("User not found");
    }

    // Attach user information to the request object
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // If authentication fails, return an error response
    res.status(401).json({ error: "Please authenticate" });
  }
};

// Middleware for role-based access control (RBAC) - Admin only
export const adminMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user && req.user.role === "ADMIN") {
    next(); // User is admin, proceed
  } else {
    res.status(403).json({ error: "Access denied. Admin only." });
  }
};

// Middleware for role-based access control (RBAC) - User only
export const userMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user && req.user.role === "USER") {
    next(); // User has the "USER" role, proceed
  } else {
    res.status(403).json({ error: "Access denied. User only." });
  }
};

// Middleware for role-based access control (RBAC) - Moderator only
export const moderatorMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user && req.user.role === "MODERATOR") {
    next(); // User has the "MODERATOR" role, proceed
  } else {
    res.status(403).json({ error: "Access denied. Moderator only." });
  }
};
