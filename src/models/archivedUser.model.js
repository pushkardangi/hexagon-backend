import mongoose, { Schema } from "mongoose";

const archivedUserSchema = new Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      default: null,
    },
    avatar: {
      type: String,
      default: null,
    },
    imageCount: {
      type: Number,
      default: 0,
    },
    accountStatus: {
      type: String,
      enum: ["inactive", "banned", "deleted"],
      default: "inactive",
    },
  },
  { timestamps: true }
);

export const ArchivedUser = mongoose.model("ArchivedUser", archivedUserSchema, "archived_users");
