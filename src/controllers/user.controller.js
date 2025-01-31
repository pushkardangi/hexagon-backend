import jwt from "jsonwebtoken";

import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinaryUsingStream, deleteFileOnCloudinary } from "../utils/cloudinary.js";
import { sendEmail } from "../utils/emailService.js";

// constants
import { maxFileSize, allowedFileTypes } from "../constants/avatar.constants.js";
import { accessTokenCookieOptions, refreshTokenCookieOptions } from "../constants/cookieOptions.js";
import {
  emailVerificationSubject,
  emailVerificationBody,
  accountDeletetionEmailSubject,
  accountDeletetionEmailBody,
} from "../constants/user.contants.js";

const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName = null, email, password } = req?.body;

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

  // Send an email for user email verification
  const emailVerificationToken = jwt.sign(
    { firstName, lastName, email },
    process.env.EMAIL_VERIFICATION_SECRET,
    {
      expiresIn: process.env.EMAIL_VERIFICATION_EXPIRY,
    }
  );

  const emailVerificationLink = process.env.ENVIRONMENT + `/api/v1/auth/verify-email?token=${emailVerificationToken}`;

  const emailSubject = emailVerificationSubject;
  const emailBody = emailVerificationBody(firstName, lastName, emailVerificationLink);

  const emailSent = await sendEmail(email, emailSubject, emailBody);

  if (!emailSent?.messageId) {
    await User.deleteOne({ email });
    throw new apiError(400, "Failed to send email verification link!")
  }

  const responseData = {
    userId: user._id,
    accountStatus: user.accountStatus,
    emailSent: emailSent.messageId ? true : false,
  };

  res
    .status(201)
    .json(new apiResponse(201, responseData, "User registered successfully."));
});

const getUserProfile = asyncHandler(async (req, res) => {
  const user = req?.user;

  if (!user) {
    throw new apiError(404, "User not found. Please log in!");
  }

  if (!user.id || !user.email) {
    throw new apiError(500, "User data is incomplete. Please contact support!");
  }

  res
    .status(200)
    .json(new apiResponse(200, user, "User profile fetched successfully."));
});

const updateUserFullname = asyncHandler(async(req, res) => {

  const { firstName, lastName } = req?.body;
  const { _id: userId } = req?.user;

  const user = await User.findById(userId);

  if (!user) {
    throw new apiError(400, "User not found! Invalid user id!");
  }

  firstName && (user.firstName = firstName);
  lastName && (user.lastName = lastName);

  const userSaved = await user.save({validateBeforeSave: false});

  if (!userSaved) {
    throw new apiError(500, "Failed to save the user data!")
  }

  const responseData = {
    userId: userSaved._id,
    firstName: userSaved.firstName,
    lastName: userSaved.lastName,
  };

  res
    .status(200)
    .json(new apiResponse(200, responseData, "User fullname updated successfully."));
});

const updateUserAvatar = asyncHandler(async(req, res) => {

  const { _id: userId, avatar: oldAvatarUrl } = req?.user;
  const avatar = req?.file;

  if (!userId){
    throw new apiError(400, "User not found!")
  }

  if (!avatar) {
    throw new apiError(400, "Avatar not found!");
  }

  if (avatar?.size > maxFileSize) {
    throw new apiError(400, "File is greater than 5Mb!");
  }

  if (!allowedFileTypes.includes(avatar?.mimetype)) {
    throw new apiError(400, "Invalid file type. Please upload an image!");
  }

  const cloudinaryResponse = await uploadOnCloudinaryUsingStream(
    avatar?.buffer,
    "image",
    "openai/user-avatar",
    ["avatar"],
    true
  );

  if (!cloudinaryResponse?.secure_url) {
    throw new apiError(500, "Failed to upload avatar on cloudinary!");
  }

  const { public_id: newAvatarPublicId, secure_url: newAvatarUrl } = cloudinaryResponse;

  const user = await User.findByIdAndUpdate(
    userId,
    { avatar: newAvatarUrl },
    { new: true }
  ).select("_id avatar");

  if (!user) {
    await deleteFileOnCloudinary(newAvatarPublicId);
    throw new apiError(500, "Failed to update avatar!");
  }

  if (oldAvatarUrl){
    const oldAvatarPublicId = "openai/user-avatar/" + oldAvatarUrl.split("/").pop().split(".")[0];
    await deleteFileOnCloudinary(oldAvatarPublicId);
  }

  const responseData = {
    userId: user._id,
    avatar: newAvatarUrl,
  };

  res
    .status(200)
    .json(new apiResponse(200, responseData, "User avatar updated successfully."));

});

const deactivateUserAccount = asyncHandler(async(req, res) => {

  const { _id: userId } = req?.user;

  const user = await User.findById(userId);

  if (!user) {
    throw new apiError(404, "User not found!");
  }

  if (user.accountStatus === "inactive") {
    throw new apiError(400, "Account is already deactivated!");
  }

  if (user.accountStatus === "banned") {
    throw new apiError(400, "Account is already banned. No changes allowed!");
  }

  user.refreshToken = null;
  user.accountStatus = "inactive";
  const updatedUser = await user.save({ validateBeforeSave: false });

  if (!updatedUser) {
    throw new apiError(500, "Failed to deactivate user!");
  }

  const responseData = {
    userId: user._id,
    accountStatus: user.accountStatus,
  }

  res
    .status(200)
    .clearCookie("accessToken", accessTokenCookieOptions)
    .clearCookie("refreshToken", refreshTokenCookieOptions)
    .json(new apiResponse(200, responseData, "Account deactivated successfully."));
});

const deleteUserAccount = asyncHandler(async(req, res) => {

  const {firstName, lastName } = req?.user;
  const { email, password } = req?.body;

  // check user authenticity
  if (!email || !password) {
    throw new apiError(400, "Email or Password are missing!");
  }

  const user = await User.findOne({email});

  if (!user) {
    throw new apiError(400, "User not found!");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new apiError(400, "Incorrect password!");
  }

  // remove user identifying data
  // adding a random number in email, to let the user create another fresh account with the same email
  // and keep the old data for further review on account.

  const random = Math.floor(Math.random() * 9000);

  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    {
      email: `${random}-${email}`,
      password: null,
      refreshToken: null,
      accountStatus: "deleted"
    },
    { new: true }
  );

  if (!updatedUser) {
    throw new apiError(500, "Failed to delete account!");
  }

  // Send a confirmation email for account deletion
  const emailSubject = accountDeletetionEmailSubject;
  const emailBody = accountDeletetionEmailBody(firstName, lastName, email);

  const emailSent = await sendEmail(email, emailSubject, emailBody);

  const responseData = {
    userId: updatedUser._id,
    accountStatus: updatedUser.accountStatus,
    emailSent: emailSent.messageId ? true : false,
  };

  res
    .status(200)
    .clearCookie("accessToken", accessTokenCookieOptions)
    .clearCookie("refreshToken", refreshTokenCookieOptions)
    .json(new apiResponse(200, responseData, "Account deleted successfully."));
});

export {
  registerUser,
  getUserProfile,
  updateUserFullname,
  updateUserAvatar,
  deactivateUserAccount,
  deleteUserAccount,
};
