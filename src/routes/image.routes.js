import { Router } from "express";
const router = Router();

// middlewares
import { verifyUser } from "../middlewares/auth.middleware.js";

// import controllers
import {
  generateImage,
  uploadImage,
  getSavedImages,
  trashImages,
  untrashImages,
  destroyImages,
} from "../controllers/image.controller.js";

router.use(verifyUser);

// routes
router.route("/generate").post(generateImage);
router.route("/upload").post(uploadImage);
router.route("/saved").get(getSavedImages);
router.route("/trash").patch(trashImages);
router.route("/untrash").patch(untrashImages);
router.route("/destroy").delete(destroyImages);

export default router;
