import { Router } from "express";
const router = Router();

// middlewares
import { verifyUser } from "../middlewares/auth.middleware.js";

// import controllers
import {
  registerUser,
} from "../controllers/user.controller.js";

// routes
router.route("/register").post(registerUser);

// secured routes


export default router;
