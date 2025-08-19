import { Feature } from "../models/index.js";
import { asyncHandler, apiError, apiResponse } from "../utils/index.js";

// Get a single feature by ID
const getFeatureById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new apiError(404, "Id not found");
  }

  const feature = await Feature.findById(id);

  if (!feature) {
    throw new apiError(404, "Feature not found");
  }

  res
    .status(200)
    .json(new apiResponse(200, feature, "Feature fetched successfully"));
});

// Update a feature by ID, Send the desired data to update
const updateFeature = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  if (!id) {
    throw new apiError(404, "Id not found");
  }

  if (!updateData) {
    throw new apiError(404, "Data to update not found");
  }

  const feature = await Feature.findByIdAndUpdate(id, updateData, {
    new: true,
  });

  if (!feature) {
    throw new apiError(404, "Feature not found or update failed");
  }

  res
    .status(200)
    .json(new apiResponse(200, feature, "Feature updated successfully"));
});

// Delete a feature by ID
const deleteFeature = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new apiError(404, "id not found");
  }

  const feature = await Feature.findByIdAndDelete(id);

  if (!feature) {
    throw new apiError(404, "Feature not found or deletion failed");
  }

  res
    .status(200)
    .json(new apiResponse(200, feature, "Feature deleted successfully"));
});

// Get features by status and/or priority
const getFeaturesByFilter = asyncHandler(async (req, res) => {
  const { status, priority } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (priority) filter.priority = priority;

  const features = await Feature.find(filter).sort({ createdAt: -1 });

  res
    .status(200)
    .json(new apiResponse(200, features, "Features fetched successfully"));
});

export { getFeatureById, updateFeature, deleteFeature, getFeaturesByFilter };
