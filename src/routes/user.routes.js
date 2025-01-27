import { Router } from "express";
const router = Router();

// middlewares
import { verifyUser } from "../middlewares/auth.middleware.js";

// import controllers
import {
  registerUser,
  getUserProfile,
  updateUserProfile,
  deactivateUserAccount,
  deleteUserAccount,
} from "../controllers/user.controller.js";

// routes
router.route("/register").post(registerUser);

// secured routes
router
  .route("/profile")
  .get(verifyUser, getUserProfile)
  .put(verifyUser, updateUserProfile)
  .patch(verifyUser, deactivateUserAccount)
  .delete(verifyUser, deleteUserAccount);

export default router;
