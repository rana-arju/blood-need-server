import type { Request, Response } from "express";
export declare const getNotifications: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const markAsRead: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getUnreadNotifications: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const syncNotification: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const subscribe: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const unsubscribe: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
