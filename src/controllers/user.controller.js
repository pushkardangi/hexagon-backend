import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

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
    throw new apiError(400, "Required fields are missing!");
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

  const {_id, firstName, lastName, avatar, imageCount, createdAt, updatedAt} = user;
  const loggedInUser = {_id, firstName, lastName, email, avatar, imageCount, createdAt, updatedAt};

  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(new apiResponse(200, loggedInUser, "User logged in successfully."));

});

export { registerUser, loginUser };
