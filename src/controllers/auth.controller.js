import jwt from "jsonwebtoken";

import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { sendEmail } from "../utils/emailService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { welcomeEmailSubject, welcomeEmailBody } from "../constants/user.contants.js";
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

const verifyUserEmail = asyncHandler(async (req, res) => {

  const verificationToken = req?.query?.token;

  if (!verificationToken) {
    throw new apiError(400, "Invalid email verification link!");
  }

  const decodedInfo = jwt.verify(verificationToken, process.env.EMAIL_VERIFICATION_SECRET);
  const { firstName, lastName, email } = decodedInfo;

  if (!email) {
    throw new apiError(400, "Verification link expired!")
  }

  const user = await User.findOneAndUpdate(
    { email },
    { accountStatus: "active" },
    { new: true }
  );

  if (!user) {
    throw new apiError(500, "Failed to verify email! Please try again!");
  }

  const emailSubject = welcomeEmailSubject;
  const emailBody = welcomeEmailBody(firstName, lastName);

  const emailSent = await sendEmail(email, emailSubject, emailBody);

  if (!emailSent?.messageId) {
    console.log("Failed to send welcome email!");
  }

  res
    .status(200)
    .json(new apiResponse(200, {}, "Email verified successfully."));

});

const loginUser = asyncHandler(async (req, res) => {
  console.time("Total Login Function Time"); // Start measuring overall login time

  console.time("Extracting Request Body");
  const { email, password } = req.body;
  console.timeEnd("Extracting Request Body");

  if (!email || !password) {
    throw new apiError(400, "Email or Password are missing!");
  }

  console.time("Finding User in Database");
  const user = await User.findOne({ email });
  console.timeEnd("Finding User in Database");

  if (!user) {
    throw new apiError(404, `User not found with email: ${email}`);
  }

  console.time("Checking Account Status");
  if (user.accountStatus !== "active") {
    throw new apiError(400, "Your email is not verified! Check your inbox to verify.");
  }
  console.timeEnd("Checking Account Status");

  console.time("Validating Password");
  const isPasswordValid = await user.isPasswordCorrect(password);
  console.timeEnd("Validating Password");

  if (!isPasswordValid) {
    throw new apiError(401, "Incorrect password. Please try again.");
  }

  console.time("Generating Access & Refresh Tokens");
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
  console.timeEnd("Generating Access & Refresh Tokens");

  console.time("Saving Refresh Token to Database");
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  console.timeEnd("Saving Refresh Token to Database");

  console.time("Formatting User Data for Response");
  const { _id, firstName, lastName, avatar, imageCount, createdAt, updatedAt } = user;
  const loggedInUser = { _id, firstName, lastName, email, avatar, imageCount, createdAt, updatedAt };
  console.timeEnd("Formatting User Data for Response");

  console.time("Setting Cookies & Sending Response");
  res
    .status(200)
    .cookie("accessToken", accessToken, accessTokenCookieOptions)
    .cookie("refreshToken", refreshToken, refreshTokenCookieOptions)
    .json(new apiResponse(200, loggedInUser, "User logged in successfully."));
  console.timeEnd("Setting Cookies & Sending Response");

  console.timeEnd("Total Login Function Time"); // End measuring overall login time
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
  verifyUserEmail,
  loginUser,
  logoutUser,
  renewAccessAndRefreshToken,
};
