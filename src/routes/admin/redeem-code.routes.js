import { Router } from "express";
import { isAdmin } from "../../middlewares/admin.middleware.js";
import {
  getRedeemCodeInfo,
  createRedeemCode,
  updateRedeemCode,
  deleteRedeemCode,
  getAllRedeemCodes,
  generateBulkRedeemCodes,
  deleteBulkRedeemCodes,
} from "../../controllers/index.js";

const router = Router();
router.use(isAdmin);

router.route("/redeem-code").post(createRedeemCode);
router
  .route("/redeem-code/:id")
  .get(getRedeemCodeInfo)
  .patch(updateRedeemCode)
  .delete(deleteRedeemCode);
router
  .route("/redeem-codes")
  .get(getAllRedeemCodes)
  .post(generateBulkRedeemCodes)
  .delete(deleteBulkRedeemCodes);

export default router;
