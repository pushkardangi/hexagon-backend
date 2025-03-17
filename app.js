import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { corsOptions } from "./src/constants/auth.constants.js";
import apiLimiter from "./src/middlewares/rateLimiter.middleware.js";

const app = express();

app.use(apiLimiter);
app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// routes
import authRouter from "./src/routes/auth.routes.js";
import userRouter from "./src/routes/user.routes.js";
import imageRouter from "./src/routes/image.routes.js";
import healthRouter from "./src/routes/health.routes.js";

// declaring routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/images", imageRouter);
app.use("/api/v1/health", healthRouter);

export default app;