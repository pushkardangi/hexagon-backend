import { Feature } from "../models/index.js";
import { asyncHandler, apiError, apiResponse } from "../utils/index.js";

// Add a new feature request
const submitFeature = asyncHandler(async (req, res) => {
  const { title, priority, description, useCase } = req?.body;
  const userId = req?.user?._id;

  if (!title || !description || !useCase || !userId) {
    throw new apiError(400, "Required fields are missing");
  }

  const feature = new Feature({
    title,
    priority: priority || "low",
    description,
    useCase,
    contributor: userId,
    releaseDate: null,
  });

  const savedFeature = await feature.save();

  if (!savedFeature) {
    throw new apiError(500, "Failed to save feature");
  }

  res
    .status(201)
    .json(
      new apiResponse(201, savedFeature, "Feature request added successfully")
    );
});

export { submitFeature };
