import { Router } from "express";
const router = Router();

// middlewares
import { verifyUser } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

// import controllers
import {
  registerUser,
  getUserProfile,
  updateUserFullname,
  updateUserAvatar,
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
  .delete(deleteUserAccount);

router.patch("/update/fullname", verifyUser, updateUserFullname);
router.patch("/update/avatar", verifyUser, upload.single("avatar"), updateUserAvatar);

export default router;
