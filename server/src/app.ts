import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import authRouter from "./modules/auth/auth.routes";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

// Security middlewares
app.use(helmet());
app.use(cors());

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