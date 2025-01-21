import { Router } from "express";
const router = Router();

// import controllers
import { registerUser } from "../controllers/user.controller.js";

// routes
router.route("/register").post(registerUser);

export default router;
