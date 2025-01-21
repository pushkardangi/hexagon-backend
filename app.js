import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// routes
import userRouter from "./src/routes/user.routes.js"

// declaring routes
app.use("/api/v1/users", userRouter);

export default app;