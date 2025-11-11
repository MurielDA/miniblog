import { ZodTypeAny, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";
import { AppError } from "@/types";

export const validate = (schema: ZodTypeAny) => {

    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params
            });
            next();
        } catch (error) {
            if(error instanceof ZodError){
                const messages = error.issues.map((err) => err.message).join(",");
                next(new AppError(400,messages));
            } else {
                next(error);
            }
        }
    };
};