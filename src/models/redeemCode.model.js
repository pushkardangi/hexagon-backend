import mongoose, { Schema } from "mongoose";

const redeemCodeSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  credits: {
    type: Number,
    required: true,
  },
  used: {
    type: Boolean,
    default: false,
  },
  usedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  usedAt: {
    type: Date,
    default: null,
  },
});

export const RedeemCode = mongoose.model("RedeemCode", redeemCodeSchema);
