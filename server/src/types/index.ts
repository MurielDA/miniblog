import { Request } from "express";

export interface JwtPayload {
    userId: string;
    email: string;
}

export interface AuthRequest extends Request {
    user?: JwtPayload;
}

export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
}

export class AppError extends Error {
    constructor(public statusCode:number, public message: string, public isOperational = true){
        super(message);
        Object.setPrototypeOf(this, AppError.prototype);
    }
} 