import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import authRouter from "./modules/auth/auth.routes";
import postRouter from "./modules/post/post.routes";
import { errorHandler } from "./middleware/error.middleware";
import commentRouter from "./modules/comment/comment.routes";

const app = express();

// Security middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.vercel.app']  // 部署后更新
    : 'http://localhost:5173',
  credentials: true,
}));

// Rate limiter
const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later."
});
app.use("/api", rateLimiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Import routes
app.use("/api/auth", authRouter);
app.use("/api/post", postRouter);
app.use("/api/comment",commentRouter);

// health check route
app.get("/api/health", (req, res) => {
    res.status(200).json({status: "OK", timestamp: new Date().toISOString()});
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
})

// Error handler
app.use(errorHandler);

export default app;