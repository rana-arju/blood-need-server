import jwt from "jsonwebtoken";
export declare const generateToken: (userId: number) => string;
export declare const verifyToken: (token: string) => string | jwt.JwtPayload;
