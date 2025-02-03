import { Router } from "express";
const router = Router();

// middlewares
import { verifyUser } from "../middlewares/auth.middleware.js";

// import controllers
import {
  generateImage,
  uploadImage,
  getSavedImages,
} from "../controllers/image.controller.js";

// routes
router.route("/generate-image").post(verifyUser, generateImage);
router.route("/upload-image").post(verifyUser, uploadImage);
router.route("/get-images").get(verifyUser, getSavedImages);

export default router;
