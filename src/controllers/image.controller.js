import OpenAI from "openai";

import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const generateImage = asyncHandler(async (req, res) => {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    let { prompt, model = "dall-e-2", size="256x256", quality, style } = req.body;
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

    if (model === "dall-e-2") {
      quality = "basic";
    } else if (model === "dall-e-3") {
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
    }

    res.status(201).json(
        new apiResponse(201, imageResponse, "Image generated successfully.")
    );
});

export { generateImage };
