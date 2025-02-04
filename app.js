import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// routes
import authRouter from "./src/routes/auth.routes.js";
import userRouter from "./src/routes/user.routes.js";
import imageRouter from "./src/routes/image.routes.js";

// declaring routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/images", imageRouter);

export default app;