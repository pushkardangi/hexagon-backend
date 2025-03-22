import mongoose, { Schema } from "mongoose";

const imageSchema = new Schema(
  {
    image: {
      type: String,
      default: null,
    },
    publicId: {
      type: String,
      default: null,
    },
    prompt: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      enum: ["dall-e-2", "dall-e-3"],
      default: "dall-e-2",
    },
    size: {
      type: String,
      enum: ["256x256", "512x512", "1024x1024", "1024x1792", "1792x1024"],
      default: "256x256",
    },
    quality: {
      type: String,
      enum: ["basic", "standard", "hd"],
      default: "basic",
    },
    style: {
      type: String,
      enum: ["simple","natural", "vivid"],
      default: "simple",
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: [ "prompt" ,"saved", "trashed", "deleted"],
      default: "prompt",
    },
  },
  { timestamps: true }
);

export const Image = mongoose.model("Image", imageSchema);
