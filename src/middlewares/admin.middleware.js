import jwt from "jsonwebtoken";
import { apiError, asyncHandler } from "../utils/index.js";

export const isAdmin = asyncHandler(async (req, _res, next) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      throw new apiError(401, "Unauthorized! Access token is missing!");
    }

    let decodedInfo;
    try {
      decodedInfo = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
      throw new apiError(401, "Access Token Expired!");
    }

    if (decodedInfo.role !== "admin") {
      throw new apiError(403, "Forbidden: Admins only");
    }

    req.user = decodedInfo;
    next();
  } catch (error) {
    throw new apiError(401, error?.message || "Error while verifying Admin!");
  }
});
