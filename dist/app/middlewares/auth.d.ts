import { NextFunction, Request, Response } from "express";
type IUserRole = "user" | "admin" | "superadmin" | "volunteer";
declare module "express-serve-static-core" {
    interface Request {
        user?: {
            id: string;
            role: IUserRole;
            email: string;
        };
    }
}
declare const auth: (...requiredRoles: IUserRole[]) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
export default auth;
