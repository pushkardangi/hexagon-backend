import jwt from "jsonwebtoken";

import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { accessTokenCookieOptions, refreshTokenCookieOptions } from "../constants/cookieOptions.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new apiError(500, "Error while generating access and refresh token!");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName = null, email, password } = req.body;

  if (!firstName || !email || !password) {
    throw new apiError(400, "Required fields are missing!");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new apiError(409, `User already exists with email: ${email}`);
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
  });

  if (!user) {
    throw new apiError(500, "Error in saving data of user!");
  }

  res
    .status(201)
    .json(new apiResponse(201, {}, "User registered successfully."));
});

const loginUser = asyncHandler(async (req, res) => {

  const {email, password} = req.body;

  if (!email || !password) {
    throw new apiError(400, "Email or Password are missing!");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new apiError(404, `User not found with email: ${email}`);
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new apiError(401, "Incorrect password. Please try again.")
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  const {_id, firstName, lastName, avatar, imageCount, createdAt, updatedAt} = user;
  const loggedInUser = {_id, firstName, lastName, email, avatar, imageCount, createdAt, updatedAt};

  res
    .status(200)
    .cookie("accessToken", accessToken, accessTokenCookieOptions)
    .cookie("refreshToken", refreshToken, refreshTokenCookieOptions)
    .json(new apiResponse(200, loggedInUser, "User logged in successfully."));

});

const logoutUser = asyncHandler(async (req, res) => {
  const loggedInUser = req.user;

  const updateUser = await User.findByIdAndUpdate(
    loggedInUser?._id,
    { $set: { refreshToken: null } },
    { new: true }
  );

  if (!updateUser) {
    throw new apiError(400, "User failed to log out!");
  }

  res
    .status(200)
    .clearCookie("accessToken", accessTokenCookieOptions)
    .clearCookie("refreshToken", refreshTokenCookieOptions)
    .json(new apiResponse(200, {}, "User logged out successfully."));
});

const renewAccessAndRefreshToken = asyncHandler(async (req, res) => {
// TODO:
// - access token expires → Server sends a 401 (Unauthorized).
// - client hits the "renew tokens" endpoint.
// - check the validity of the refresh token:
//    - if invalid, prompt the user to log in.
//    - if valid, continue to the next steps.
// - find the user using their `_id`.
// - verify the refresh token matches the one stored in the database (for added security).
// - if they match, generate new access and refresh tokens.
// - save the new refresh token in the database.
// - send both access and refresh tokens to the client in HTTP-only cookies.

  const token = req?.cookies?.refreshToken;

  if (!token) {
    throw new apiError(401, "Unauthorized! Refresh token is missing!");
  }

  let decodedInfo;
  try {
    decodedInfo = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    throw new apiError(401, "Unauthorized! Refresh Token Expired!");
  }

  const user = await User.findById(decodedInfo._id);

  if (!user) {
    throw new apiError(404, "User not found. Unable to renew tokens!");
  }

  if (token !== user.refreshToken){
    throw new apiError(401, "Refresh token mismatch. Please log in again!");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

  user.refreshToken = refreshToken;
  const userSaved = await user.save({ validateBeforeSave: false });

  if (!userSaved){
    throw new apiError(500, "Failed to save the refresh token!");
  }

  res
    .status(200)
    .cookie("accessToken", accessToken, accessTokenCookieOptions)
    .cookie("refreshToken", refreshToken, refreshTokenCookieOptions)
    .json(new apiResponse(200, {}, "Access and refresh tokens renewed successfully."));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  renewAccessAndRefreshToken,
};
