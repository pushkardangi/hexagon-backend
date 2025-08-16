import mongoose, { Schema } from "mongoose";

const environmentSchema = new Schema(
  {
    browser: { type: String, required: true },
    deviceType: { type: String, required: true },
    os: { type: String, required: true },
  },
  { _id: false }
);

const bugSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["UI", "Backend", "Performance", "Security", "Other"],
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    severity: {
      type: String,
      required: true,
      enum: ["Low", "Medium", "High", "Critical"],
    },
    environment: {
      type: environmentSchema,
      required: true,
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved", "Closed"],
      default: "Open",
    },
    reportedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Bug = mongoose.model("Bug", bugSchema);
