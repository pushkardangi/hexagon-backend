import { asyncHandler } from "../utils/asyncHandler.js";

const healthCheck = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json({
      success: true,
      message: "API is Healthy, Wealthy and Wise!",
      var: process.env.SAMPLE_VAR,
      timestamp: new Date().toISOString(),
    });
});

export { healthCheck };
