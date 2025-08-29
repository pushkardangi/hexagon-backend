import mongoose from "mongoose";
import { Image } from "../models/index.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteFileOnCloudinary } from "../utils/cloudinary.js";

const getAllImages = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    status,
    ownerId,
    prompt,
    model,
    size,
    startDate,
    endDate,
    sort = "desc",
  } = req.query;

  const query = {};

  if (status) query.status = status;
  if (ownerId && mongoose.isValidObjectId(ownerId)) query.ownerId = ownerId;
  if (prompt) query.prompt = { $regex: prompt, $options: "i" };
  if (model) query.model = model;
  if (size) query.size = size;

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  const skip = (page - 1) * limit;

  const [images, total] = await Promise.all([
    Image.find(query)
      .populate("ownerId", "firstName lastName email role")
      .sort({ createdAt: sort === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(Number(limit)),
    Image.countDocuments(query),
  ]);

  return res.status(200).json(
    new apiResponse(
      200,
      {
        images,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          hasMore: skip + images.length < total,
        },
      },
      "Images fetched successfully."
    )
  );
});

const getImageById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    throw new apiError(400, "Invalid image ID!");
  }

  const image = await Image.findById(id).populate(
    "ownerId",
    "firstName lastName email role"
  );

  if (!image) throw new apiError(404, "Image not found!");

  return res
    .status(200)
    .json(new apiResponse(200, image, "Image fetched successfully."));
});

const updateImageStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!mongoose.isValidObjectId(id)) {
    throw new apiError(400, "Invalid image ID!");
  }

  const validStatuses = ["prompt", "saved", "trashed", "archived", "deleted"];
  if (!validStatuses.includes(status)) {
    throw new apiError(400, "Invalid status value!");
  }

  const updatedImage = await Image.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );

  if (!updatedImage) throw new apiError(404, "Image not found!");

  return res
    .status(200)
    .json(
      new apiResponse(200, updatedImage, "Image status updated successfully.")
    );
});

const deleteImagePermanently = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    throw new apiError(400, "Invalid image ID!");
  }

  const image = await Image.findById(id);
  if (!image) throw new apiError(404, "Image not found!");

  if (image.publicId) {
    await deleteFileOnCloudinary(image.publicId, "image");
  }

  await Image.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new apiResponse(200, {}, "Image deleted permanently."));
});

const bulkUpdateStatus = asyncHandler(async (req, res) => {
  const { ids, status } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    throw new apiError(400, "No image IDs provided!");
  }

  const validStatuses = ["prompt", "saved", "trashed", "archived", "deleted"];
  if (!validStatuses.includes(status)) {
    throw new apiError(400, "Invalid status value!");
  }

  await Image.updateMany({ _id: { $in: ids } }, { status });

  return res
    .status(200)
    .json(
      new apiResponse(200, { ids, status }, "Statuses updated successfully.")
    );
});

const bulkDeleteImages = asyncHandler(async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    throw new apiError(400, "No image IDs provided!");
  }

  const images = await Image.find({ _id: { $in: ids } });

  await Promise.all(
    images.map(
      (img) => img.publicId && deleteFileOnCloudinary(img.publicId, "image")
    )
  );

  await Image.deleteMany({ _id: { $in: ids } });

  return res
    .status(200)
    .json(new apiResponse(200, { ids }, "Images deleted permanently."));
});

const getImageAnalytics = asyncHandler(async (_, res) => {
  const total = await Image.countDocuments();

  const [byStatus, byModel, bySize, byQuality, byStyle, perUser] =
    await Promise.all([
      Image.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      Image.aggregate([{ $group: { _id: "$model", count: { $sum: 1 } } }]),
      Image.aggregate([{ $group: { _id: "$size", count: { $sum: 1 } } }]),
      Image.aggregate([{ $group: { _id: "$quality", count: { $sum: 1 } } }]),
      Image.aggregate([{ $group: { _id: "$style", count: { $sum: 1 } } }]),
      Image.aggregate([
        { $group: { _id: "$ownerId", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
    ]);

  return res.status(200).json(
    new apiResponse(
      200,
      {
        total,
        byStatus,
        byModel,
        bySize,
        byQuality,
        byStyle,
        perUser,
      },
      "Image analytics fetched successfully."
    )
  );
});

export {
  getAllImages,
  bulkUpdateStatus,
  bulkDeleteImages,
  getImageById,
  updateImageStatus,
  deleteImagePermanently,
  getImageAnalytics,
};
