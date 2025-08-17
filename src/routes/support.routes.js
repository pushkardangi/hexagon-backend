import { Router } from "express";
import { verifyUser } from "../middlewares/index.js";
import { submitFeature } from "../controllers/index.js";

const router = Router();

router.route("/feature").post(verifyUser, submitFeature);

export default router;
