import { AppError } from "@/types";
import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "@/types";
import { env } from "@/config/env";

export const errorHandler = (err: Error | AppError, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
        const response: ApiResponse = {
            success: false,
            message: err.message
        }
        return res.status(err.statusCode).json(response);
    }

    if(err.name === "MongoServerError" && (err as any).code === 11000){
        const field = Object.keys((err as any).keyPattern)[0];
        const response: ApiResponse = {
            success: false,
            message: `${field} already exists`
        }
        return res.status(400).json(response);
        
    };

    // Handle other validation errors (e.g., Mongoose validation errors)
    if(err.name === "ValidationError"){
        const response: ApiResponse = {
            success: false,
            message: err.message
        };
        return res.status(400).json(response);
    }
     console.error("Unexpected Error: ", err);

     const response: ApiResponse = {
        success: false,
        message: env.NODE_ENV === "development" ? err.message : "Internal Server Error"
    };
    return res.status(500).json(response);
    
};