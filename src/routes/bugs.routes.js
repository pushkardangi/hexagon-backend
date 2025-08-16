import { Router } from "express";
import { verifyUser } from "../middlewares/auth.middleware.js";
import { createBugReport } from "../controllers/index.js";

const router = Router();

router.route("/report").post(verifyUser, createBugReport);

export default router;
