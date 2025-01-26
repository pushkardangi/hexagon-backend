import { Router } from "express";
const router = Router();

// middlewares
import { verifyUser } from "../middlewares/auth.middleware.js";

// import controllers
import { registerUser, loginUser, logoutUser } from "../controllers/user.controller.js";

// routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// secured routes
router.route("/logout").delete(verifyUser, logoutUser)

export default router;
