import mongoose, { Schema } from "mongoose";

const featureSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },
    description: {
      type: String,
      required: true,
    },
    useCase: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "in-progress", "completed", "rejected"],
      default: "pending",
    },
    contributor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    releaseDate: {
      type: Date,
      required: false,
      default: null,
    },
  },
  { timestamps: true }
);

export const Feature = mongoose.model("Feature", featureSchema);
