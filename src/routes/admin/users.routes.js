import { Router } from "express";
import { isAdmin } from "../../middlewares/admin.middleware.js";
import { fetchAllUsers } from "../../controllers/index.js";

const router = Router();
router.use(isAdmin);

router.route("/users").get(isAdmin, fetchAllUsers);

export default router;
