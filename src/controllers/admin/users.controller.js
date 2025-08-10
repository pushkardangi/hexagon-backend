import { User } from "../../models/index.js";
import { asyncHandler, apiResponse, apiError } from "../../utils/index.js";

export const fetchAllUsers = asyncHandler(async (req, res) => {
  try {
    let {
      page = 1,
      limit = 20,
      search = "",
      sort = "-createdAt",
      role,
      accountStatus,
    } = req.query;

    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    // Build filter
    const filter = {};
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    if (role) {
      filter.role = role;
    }
    if (accountStatus) {
      filter.accountStatus = accountStatus;
    }

    // Fetch total count for pagination
    const totalUsers = await User.countDocuments(filter);

    // Fetch users with pagination
    const users = await User.find(filter)
      .select("-password -refreshToken -passwordResetOTP -passwordResetExpiry")
      .sort(sort) // Example: "-createdAt" or "firstName"
      .skip((page - 1) * limit)
      .limit(limit);

    const responseData = {
      users,
      pagination: {
        total: totalUsers,
        page,
        limit,
        hasMore: page * limit < totalUsers,
      },
    };

    res
      .status(200)
      .json(new apiResponse(200, responseData, "Users fetched successfully"));
  } catch (error) {
    throw new apiError(500, error.message || "Failed to fetch users");
  }
});
