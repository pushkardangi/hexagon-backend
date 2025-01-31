import { Router } from "express";
const router = Router();

// middlewares
import { verifyUser } from "../middlewares/auth.middleware.js";

// import controllers
import {
  verifyUserEmail,
  loginUser,
  logoutUser,
  renewAccessAndRefreshToken,
} from "../controllers/auth.controller.js";

// routes
router.route("/verify-email").get(verifyUserEmail);
router.route("/login").post(loginUser);
router.route("/renew-tokens").post(renewAccessAndRefreshToken);

// secured routes
router.route("/logout").delete(verifyUser, logoutUser);

export default router;
