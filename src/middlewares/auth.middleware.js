import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyUser = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      throw new apiError(401, "Unauthorized request! Token not available!");
    }

    const decodedInfo = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedInfo?._id).select("-password -refreshToken");

    if (!user) {
      throw new apiError(401, "Invalid access token!");
    }

    req.user = user;
    next();

  } catch (error) {
    throw new apiError(401, error?.message || "Error while verifying User!");
  }
});
