import { authService } from "./auth.service";
import { Request, Response, NextFunction } from "express";
import { ApiResponse, AuthRequest } from "@/types/index";

class AuthController {
    async register(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const result = await authService.register(req.body);

            const response: ApiResponse = {
                success: true,
                message: "User registered succcessfully",
                data: result
            };
            res.status(201).json(response);
        } catch (error) {
            next(error);
        }
    };

    async login(req: AuthRequest, res: Response, next: NextFunction) {
        try{
            const result = await authService.login(req.body);
            const response: ApiResponse = {
                success: true,
                message: "User logged in successfully",
                data: result
            };
            res.status(200).json(response);
        }catch(error){
            next(error);
        }
    };

    async getMyProfile(req: AuthRequest, res: Response, next: NextFunction) {
        try{
            const userId = req.user?.userId ?? "";
            const result = await authService.getUserById(userId);
            const response: ApiResponse = {
                success: true,
                message: "User profile fetched successfully",
                data: result
            };
            res.status(200).json(response);
        }catch(error){
            next(error);
        }
    };

    async getProfileById(req: AuthRequest, res: Response, next: NextFunction){
        try{
            const userId = req.params.userId;
            const result = await authService.getUserById(userId);
            const response: ApiResponse = {
                success: true,
                message: "User profile fetched successfully",
                data: result
            };
            res.status(200).json(response);
        }catch(error){
            next(error);
        }
    }
};

export const authController = new AuthController();