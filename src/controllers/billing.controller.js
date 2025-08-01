import { User, RedeemCode } from "../models/index.js";
import { asyncHandler, apiResponse, apiError } from "../utils/index.js";

const redeemCode = asyncHandler(async (req, res) => {
  const { _id: userId } = req?.user ?? {};
  const { code } = req.body;

  if (!code || !code.trim()) {
    return res.status(400).json({ message: "Redeem Code is required." });
  }

  try {
    const redeem = await RedeemCode.findOne({ code: code.trim() });

    if (!redeem) {
      return res.status(404).json({ message: "Invalid or expired code." });
    }

    if (redeem.used) {
      return res
        .status(409)
        .json({ message: "This code has already been used." });
    }

    // Add credits to user
    const user = await User.findById(userId);
    user.credits += redeem.credits;
    await user.save();

    // Mark redeem code as used
    redeem.used = true;
    redeem.usedBy = userId;
    redeem.usedAt = new Date();
    await redeem.save();

    const responseData = {
      creditsAdded: redeem.credits,
      totalCredits: user.credits,
    };

    return res
      .status(200)
      .json(new apiResponse(200, responseData, "Credits added successfully."));
  } catch (error) {
    throw new apiError(
      500,
      error.message || "Something went wrong while redeeming code!"
    );
  }
});

export { redeemCode };
