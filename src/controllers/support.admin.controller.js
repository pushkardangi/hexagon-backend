import { Feature } from "../models/index.js";
import { asyncHandler, apiError, apiResponse } from "../utils/index.js";

// Get all feature requests
const getAllFeatures = asyncHandler(async (_req, res) => {
  const features = await Feature.find().sort({ createdAt: -1 });

  if (!features) {
    throw new apiError(500, "Failed to fetch features");
  }

  res
    .status(200)
    .json(new apiResponse(200, features, "Features fetched successfully"));
});

export { getAllFeatures };
