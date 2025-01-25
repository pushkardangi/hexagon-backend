import OpenAI from "openai";
import { Image } from "../models/image.model.js";
import { User } from "../models/user.model.js";

import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateImage = asyncHandler(async (req, res) => {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    let { prompt, model = "dall-e-2", size="256x256", quality="basic", style="simple" } = req.body;
    const user = req.user._id.toString();

    if (!prompt) {
        throw new apiError(400, "Prompt is missing!");
    }

    if (!user) {
        throw new apiError(400, "User Id is missing!");
    }

    let imageConfig = {
      prompt,
      model,
      n: 1,
      response_format: "url",
      size,
      user,
    };

    if (model === "dall-e-3") {
      if (quality) imageConfig.quality = quality;
      if (style) imageConfig.style = style;
    }

    const openaiResponse = await openai.images.generate(imageConfig);
    const image = openaiResponse.data[0].url;

    if (!image) {
      throw new apiError(500, "Error while generating image!");
    }

    const imageResponse = {
      image,
      prompt,
      model,
      size,
      quality,
      style,
    };

    res.status(201).json(
        new apiResponse(201, imageResponse, "Image generated successfully.")
    );
});

const uploadImage = asyncHandler(async (req, res) => {

  const { image, prompt, model, size, quality, style } = req.body;
  const { _id: ownerId, imageCount: prevImageCount } = req.user;

  if (!image || !prompt || !model || !size || !quality || !style) {
    throw new apiError(400, "One or more required fields are missing!");
  }
  if (!ownerId || !prevImageCount) {
    throw new apiError(400, "Owner details are missing!");
  }

  const cloudinaryResponse = await uploadOnCloudinary(image,"image", model, [size]);
  const { secure_url, public_id } = cloudinaryResponse || {};

  if(!secure_url || !public_id){
    throw new apiError(500, "Failed uploading image on cloudinary!");
  }

  const savedImage = await Image.create({
    image: secure_url,
    publicId: public_id,
    prompt,
    model,
    size,
    quality,
    style,
    ownerId,
  });

  if (!savedImage) {
    throw new apiError(500, "Failed to save image information!")
  }

  const updatedImageCount = await User.findByIdAndUpdate(ownerId, { $inc: { imageCount: 1 } }, { new: true });

  if (!updatedImageCount || updatedImageCount.imageCount <= prevImageCount) {
    throw new apiError(500, "Failed to update image count!");
  }

  res
    .status(201)
    .json(new apiResponse(201, {}, "Image uploaded successfully."));
});

export { generateImage, uploadImage };
