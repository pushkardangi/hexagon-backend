import { Router } from "express";
const router = Router();

// middlewares
import { verifyUser } from "../middlewares/auth.middleware.js";

// import controllers
import { redeemCode } from "../controllers/billing.controller.js";

router.route("/redeem").post(verifyUser, redeemCode);

export default router;
