import { AuthService } from "./auth.service";
import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../../types/index";

const authService = new AuthService();

export class AuthController {
    async register(req: Request, res: Response, next: NextFunction) {
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

    async login(req: Request, res: Response, next: NextFunction) {
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
};