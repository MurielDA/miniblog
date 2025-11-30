import { Router } from 'express';
import { authController } from './auth.controller';
import { validate } from '@/middleware/validate.middleware';
import { registerSchema, loginSchema, getUserInfoByIdSchema } from './auth.validation';
import { authenticate } from '@/middleware/auth.middleware';

const authRouter = Router();

authRouter.post("/register", validate(registerSchema), authController.register);
authRouter.post("/login", validate(loginSchema), authController.login);

authRouter.get("/me", authenticate, authController.getMyProfile);
authRouter.get("/:userId", validate(getUserInfoByIdSchema), authController.getProfileById);

export default authRouter;