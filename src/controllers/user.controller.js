import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

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

const updateUserProfile = asyncHandler(async(req, res) => {

});

const deactivateUserAccount = asyncHandler(async(req, res) => {

});

const deleteUserAccount = asyncHandler(async(req, res) => {

});

export {
  registerUser,
  getUserProfile,
  updateUserProfile,
  deactivateUserAccount,
  deleteUserAccount,
};
