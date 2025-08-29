import { Router } from "express";
const router = Router();

// middlewares
import { isAdmin } from "../middlewares/index.js";

// import controllers
import {
  getAllImages,
  bulkUpdateStatus,
  bulkDeleteImages,
  getImageById,
  updateImageStatus,
  deleteImagePermanently,
  getImageAnalytics,
} from "../controllers/index.js";

router.use(isAdmin);

// routes
router
  .route("/")
  .get(getAllImages)
  .patch(bulkUpdateStatus)
  .delete(bulkDeleteImages);

router.route("/analytics").get(getImageAnalytics);

router
  .route("/:id")
  .get(getImageById)
  .patch(updateImageStatus)
  .delete(deleteImagePermanently);

export default router;
