import { Router } from "express";
import { isAdmin } from "../middlewares/index.js";
import {
  getFeatureById,
  updateFeature,
  deleteFeature,
  getFeaturesByFilter,
} from "../controllers/index.js";

const router = Router();

router.route("/feature").get(isAdmin, getFeaturesByFilter);

router
  .route("/feature/:id")
  .all(isAdmin)
  .get(getFeatureById)
  .patch(updateFeature)
  .delete(deleteFeature);

export default router;
