import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validate } from '@/middleware/validate.middleware';
import { registerSchema, loginSchema } from './atuth.validation';

const authRouter = Router();
const authController = new AuthController();

authRouter.post("/register", validate(registerSchema), authController.register);
authRouter.post("/login", validate(loginSchema), authController.login);

export default authRouter;