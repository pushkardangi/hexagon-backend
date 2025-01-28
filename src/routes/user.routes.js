import { Router } from "express";
const router = Router();

// middlewares
import { verifyUser } from "../middlewares/auth.middleware.js";

// import controllers
import {
  registerUser,
  getUserProfile,
  updateUserFullname,
  deactivateUserAccount,
  deleteUserAccount,
} from "../controllers/user.controller.js";

// routes
router.route("/register").post(registerUser);

// secured routes
router
  .route("/profile")
  .get(verifyUser, getUserProfile)
  .patch(verifyUser, deactivateUserAccount)
  .delete(verifyUser, deleteUserAccount);

router.patch("/update/fullname", verifyUser, updateUserFullname);

export default router;
