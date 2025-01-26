import { Router } from "express";
const router = Router();

// middlewares
import { verifyUser } from "../middlewares/auth.middleware.js";

// import controllers
import {
  registerUser,
  loginUser,
  logoutUser,
  renewAccessAndRefreshToken,
} from "../controllers/user.controller.js";

// routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/renew-tokens").post(renewAccessAndRefreshToken);

// secured routes
router.route("/logout").delete(verifyUser, logoutUser);

export default router;
