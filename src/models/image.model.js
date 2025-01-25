import mongoose, { Schema } from "mongoose";

const imageSchema = new Schema(
  {
    image: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
    prompt: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      enum: ["dall-e-2", "dall-e-3"],
      required: true,
    },
    size: {
      type: String,
      enum: ["256x256", "512x512", "1024x1024", "1024x1792", "1792x1024"],
      required: true,
    },
    quality: {
      type: String,
      enum: ["basic", "standard", "hd"],
      default: "basic",
      required: true,
    },
    style: {
      type: String,
      enum: ["simple","natural", "vivid"],
      required: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "trashed", "deleted"],
      default: "active",
    },
  },
  { timestamps: true }
);

export const Image = mongoose.model("Image", imageSchema);
