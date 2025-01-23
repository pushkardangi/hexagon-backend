import { Router } from "express";
const router = Router();

// middlewares
import { verifyUser } from "../middlewares/auth.middleware.js";

// import controllers
import { generateImage } from "../controllers/image.controller.js";

// routes
router.route("/generate-image").post(verifyUser, generateImage);

export default router;
