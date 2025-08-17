import { Router } from "express";
import { isAdmin } from "../middlewares/index.js";
import { getAllFeatures } from "../controllers/index.js";

const router = Router();

router.route("/feature").get(isAdmin, getAllFeatures);

export default router;
