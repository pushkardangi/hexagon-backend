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

export { registerUser };
