import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { corsOptions } from "./src/constants/auth.constants.js";
import { apiLimiter } from "./src/middlewares/index.js";

const app = express();

app.set("trust proxy", 1); // for render
app.use(apiLimiter);
app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// routes
import {
  authRouter,
  userRouter,
  imageRouter,
  adminImageRouter,
  billingRouter,
  healthRouter,
  redeemCodeRouter,
  userManagementRouter,
  bugReportRouter,
  supportRouter,
  adminSupportRouter,
} from "./src/routes/index.js";

// declaring routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/images", imageRouter);
app.use("/api/v1/billing", billingRouter);
app.use("/api/v1/bugs", bugReportRouter);
app.use("/api/v1/support", supportRouter);

app.use("/api/v1/admin", redeemCodeRouter);
app.use("/api/v1/admin", userManagementRouter);
app.use("/api/v1/admin/support", adminSupportRouter);
app.use("/api/v1/admin/images", adminImageRouter);
app.use("/api/v1/health", healthRouter);

export default app;
