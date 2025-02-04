import { Router } from "express";
const router = Router();

// middlewares
import { verifyUser } from "../middlewares/auth.middleware.js";

// import controllers
import {
  generateImage,
  uploadImage,
  getSavedImages,
  trashImages
} from "../controllers/image.controller.js";

// routes
router.route("/generate-image").post(verifyUser, generateImage);
router.route("/upload-image").post(verifyUser, uploadImage);
router.route("/get-images").get(verifyUser, getSavedImages);
router.route("/trash-images").delete(verifyUser, trashImages);

export default router;
