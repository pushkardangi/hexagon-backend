import OpenAI from "openai";
import mongoose from "mongoose";

import { User, Image } from "../models/index.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary, deleteFileOnCloudinary } from "../utils/cloudinary.js";
import { imageGenerationCost } from "../constants/cost.constants.js";

const generateImage = asyncHandler(async (req, res) => {

  let { prompt, model = "dall-e-2", size="256x256", quality="basic", style="simple" } = req?.body ?? {};
  const { _id: userId } = req?.user ?? {};

  if (!prompt) throw new apiError(400, "Prompt is required!");
  if (!userId) throw new apiError(400, "User ID is required!");

  const cost = model === "dall-e-2"
    ? imageGenerationCost[model]?.[size] ?? 0
    : imageGenerationCost[model]?.[quality]?.[size] ?? 0;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId).session(session);

    if (cost > user.credits) {
      throw new apiError(400, "Insufficient credits to generate the image!");
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const openaiResponse = await openai.images.generate({
      prompt,
      model,
      size,
      n: 1,
      response_format: "url",
      user: userId,
      ...(model === "dall-e-3" && { quality, style }),
    });
    const image = openaiResponse?.data?.[0]?.url;

    if (!image) {
      throw new apiError(500, "Failed to generate image. Please try again!");
    }

    user.credits -= cost;
    user.imageCount += 1;

    await user.save({ validateBeforeSave: false, session });

    const savedImage = await Image.create(
      [
        { image: null, publicId: null, prompt, model, size, quality, style, ownerId: userId }
      ],
      { session }
    );

    if (!savedImage) {
      throw new apiError(500, "Failed to save image information!");
    }

    await session.commitTransaction();
    session.endSession();

    const responseData = {
      imageId: savedImage[0]._id,
      imageUrl: image
    };

    return res
      .status(201)
      .json(new apiResponse( 201, responseData, "Image generated successfully."));

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new apiError(500, error.message || "Image generation failed!");
  }

});

const uploadImage = asyncHandler(async (req, res) => {

  const { imageUrl, imageId } = req?.body ?? {};

  if (!imageUrl || !mongoose.isValidObjectId(imageId)) {
    throw new apiError(400, "Image URL and Image ID are required!");
  }

  const image = await Image.findById(imageId);

  if (!image) {
    throw new apiError(404, `No image document found with ID: ${imageId}`);
  }

  const { model, size } = image;

  const cloudinaryResponse = await uploadOnCloudinary(imageUrl,"image", model, [size]);
  const { secure_url, public_id } = cloudinaryResponse || {};

  if(!secure_url || !public_id){
    throw new apiError(500, "Failed to upload image to Cloudinary. Please try again.");
  }

  image.image = secure_url;
  image.publicId = public_id;
  image.status = "saved";

  const savedImage = await image.save({ validateBeforeSave: false });

  if (!savedImage) {
    throw new apiError(500, "Failed to save image information!")
  }

  return res
    .status(201)
    .json(new apiResponse(201, {}, "Image uploaded successfully."));
});

const getSavedImages = asyncHandler(async (req, res) => {
  // get pagination params from query
  const page = Math.max(1, parseInt(req?.query?.page, 10) || 1);
  const limit = Math.max(1, parseInt(req?.query?.limit, 10) || 12);

  // get logged-in user's ID
  const { _id: userId } = req?.user || {};

  if (!userId) {
    throw new apiError(400, "User id not found!");
  }

  // fetch total count for pagination logic
  const totalImages = await Image.countDocuments({ ownerId: userId, status: "saved" });

  if (totalImages === 0) {
    return res
      .status(200)
      .json(new apiResponse(200, { images: [], hasMoreImages: false, totalImages }, "No images found!"));
  }

  // calculate skip value
  const skip = (page - 1) * limit;

  // fetch paginated images
  const images = await Image.find({ ownerId: userId, status: "saved" })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const hasMoreImages = totalImages > page * limit;

  res.status(200).json(
    new apiResponse(
      200,
      { images, hasMoreImages, totalImages },
      "Images fetched successfully."
    )
  );
});

const trashImages = asyncHandler(async (req, res) => {
  // TODO: shift images from active to trashed status

  const { images: imageIds } = req?.body;
  const { _id: userId } = req?.user;
  const imagesToTrash = Array.isArray(imageIds) ? imageIds.length : 0;

  if (!imagesToTrash) {
    throw new apiError(400, "No image IDs provided!");
  }

  const updatedImages = await Image.updateMany(
    { ownerId: userId, status: "active", _id: { $in: imageIds } },
    { $set: { status: "trashed" } }
  );

  if (updatedImages.modifiedCount !== imagesToTrash) {
    throw new apiError(404, "No images found to trash!");
  }

  return res
    .status(200)
    .json(new apiResponse(200, updatedImages, "Images trashed successfully."));
});

const untrashImages = asyncHandler(async (req, res) => {
  // TODO: shift images from trashed to active status

  const { images: imageIds } = req?.body;
  const { _id: userId } = req?.user;
  const imagesToUntrash = Array.isArray(imageIds) ? imageIds.length : 0;

  if (!imagesToUntrash) {
    throw new apiError(400, "No image IDs provided!");
  }

  const updatedImages = await Image.updateMany(
    { ownerId: userId, status: "trashed", _id: { $in: imageIds } },
    { $set: { status: "active" } }
  );

  if (updatedImages.modifiedCount !== imagesToUntrash) {
    throw new apiError(404, "No images found to untrash!");
  }

  return res
    .status(200)
    .json(new apiResponse(200, updatedImages, "Images untrashed successfully."));
});

const destroyImages = asyncHandler(async (req, res) => {
  const { images: imageIds } = req.body;
  const { _id: userId } = req.user;

  if (!Array.isArray(imageIds) || imageIds.length === 0) {
    throw new apiError(400, "No image IDs provided!");
  }

  const images = await Image.find({
    ownerId: userId,
    status: "trashed",
    _id: { $in: imageIds },
  });

  if (!images.length) {
    throw new apiError(404, "No images found!");
  }

  const cloudinaryPublicIds = images.map(img => img.publicId);

  await Promise.all(cloudinaryPublicIds.map(id => deleteFileOnCloudinary(id,"image")));

  const deletedImages = await Image.deleteMany(
    { ownerId: userId, status: "trashed", _id: { $in: imageIds } },
  );

  if (deletedImages.deletedCount !== images.length) {
    throw new apiError(500, "Image deletion failed!");
  }

  res
    .status(200)
    .json(
      new apiResponse(
        200,
        deletedImages,
        "Images deleted successfully."
      )
    );

});

export {
  generateImage,
  uploadImage,
  getSavedImages,
  trashImages,
  untrashImages,
  destroyImages,
};
