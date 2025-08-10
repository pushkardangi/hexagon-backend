import mongoose from "mongoose";
import { RedeemCode } from "../../models/index.js";
import { asyncHandler, apiResponse, apiError } from "../../utils/index.js";

// Creates a new redeem code with given code, credits, and expiry date.
// Validates required fields, checks for duplicates, and stores it in the database.
const createRedeemCode = asyncHandler(async (req, res) => {
  const { code, credits, expiresAt } = req.body;

  if (!code) throw new apiError(400, "Missing required field: Code");
  if (!credits) throw new apiError(400, "Missing required field: Credits");
  if (!expiresAt)
    throw new apiError(400, "Missing required field: Expiry Date");

  if (typeof credits !== "number" || credits <= 0) {
    throw new apiError(400, "Credits must be a positive number");
  }

  let expiryDate = null;
  const parsedDate = new Date(expiresAt);
  if (isNaN(parsedDate)) {
    throw new apiError(400, "Invalid date format. Use YYYY-MM-DD or ISO 8601.");
  }
  expiryDate = parsedDate;

  const existingCode = await RedeemCode.findOne({ code });
  if (existingCode) {
    throw new apiError(409, "Redeem code already exists!");
  }

  const redeemCode = await RedeemCode.create({
    code,
    credits,
    expiresAt: expiryDate,
  });

  return res
    .status(201)
    .json(new apiResponse(201, redeemCode, "Redeem code created successfully"));
});

// Fetches a single redeem code by its ID.
// Validates ID format and returns the code details if found.
const getRedeemCodeInfo = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new apiError(400, "Invalid redeem code ID");
  }

  const redeemCode = await RedeemCode.findById(id);
  if (!redeemCode) {
    throw new apiError(404, "Redeem code not found");
  }

  return res
    .status(200)
    .json(new apiResponse(200, redeemCode, "Redeem code fetched successfully"));
});

// Updates an existing redeem code's details like code, credits, and expiry date.
// Ensures uniqueness for code and validates input before saving.
const updateRedeemCode = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { code, credits, expiresAt } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new apiError(400, "Invalid redeem code ID");
  }

  const redeemCode = await RedeemCode.findById(id);
  if (!redeemCode) {
    throw new apiError(404, "Redeem code not found");
  }

  if (code) {
    const existingCode = await RedeemCode.findOne({ code, _id: { $ne: id } });
    if (existingCode) {
      throw new apiError(
        409,
        "Another redeem code with this code already exists"
      );
    }
    redeemCode.code = code;
  }

  if (credits) {
    if (typeof credits !== "number" || credits <= 0) {
      throw new apiError(400, "Credits must be a positive number");
    }
    redeemCode.credits = credits;
  }

  if (expiresAt) {
    const parsedDate = new Date(expiresAt);
    if (isNaN(parsedDate)) {
      throw new apiError(
        400,
        "Invalid date format. Use YYYY-MM-DD or ISO 8601."
      );
    }
    redeemCode.expiresAt = parsedDate;
  }

  await redeemCode.save();

  return res
    .status(200)
    .json(new apiResponse(200, redeemCode, "Redeem code updated successfully"));
});

// Deletes a redeem code by its ID.
// Validates ID format and removes the record if it exists.
const deleteRedeemCode = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new apiError(400, "Invalid redeem code ID");
  }

  const redeemCode = await RedeemCode.findByIdAndDelete(id);
  if (!redeemCode) {
    throw new apiError(404, "Redeem code not found");
  }

  return res
    .status(200)
    .json(new apiResponse(200, null, "Redeem code deleted successfully"));
});

// Generates multiple redeem codes in one request using a base code name.
// Ensures the base code is unique, then appends sequential numbers to create codes.
// All codes share the same credits and expiry date, and are inserted in bulk for efficiency.
const generateBulkRedeemCodes = asyncHandler(async (req, res) => {
  const { count, credits, expiresAt, baseCode } = req.body;

  // Validate input
  if (!count || !credits || !expiresAt || !baseCode) {
    throw new apiError(
      400,
      "count, credits, expiresAt, and baseCode are required"
    );
  }

  if (typeof count !== "number" || count <= 0) {
    throw new apiError(400, "count must be a positive number");
  }

  if (typeof credits !== "number" || credits <= 0) {
    throw new apiError(400, "credits must be a positive number");
  }

  const parsedDate = new Date(expiresAt);
  if (isNaN(parsedDate)) {
    throw new apiError(400, "Invalid date format. Use YYYY-MM-DD or ISO 8601.");
  }

  // Check if baseCode already exists
  const formattedBaseCode = baseCode.trim().toUpperCase();
  const existingCodes = await RedeemCode.find({
    code: new RegExp(`^${formattedBaseCode}`, "i"),
  });
  if (existingCodes.length > 0) {
    throw new apiError(
      409,
      `Redeem codes starting with "${baseCode}" already exist.`
    );
  }

  // Generate codes
  const newCodes = [];
  for (let i = 1; i <= count; i++) {
    newCodes.push({
      code: `${formattedBaseCode}${i}`,
      credits,
      expiresAt: parsedDate,
    });
  }

  // Insert all codes at once
  const redeemCodes = await RedeemCode.insertMany(newCodes);

  return res
    .status(201)
    .json(
      new apiResponse(
        201,
        redeemCodes,
        "Bulk redeem codes generated successfully"
      )
    );
});

// Retrieves all redeem codes from the database.
// Supports optional query filtering by used, unused, expiry and sort by credit value.
const getAllRedeemCodes = asyncHandler(async (req, res) => {
  const { filter, sort } = req.query;
  // filter = used, unused, expired, expiringSoon, all
  // sort = highValue, lowValue

  let query = {};
  let sortOrder = { createdAt: -1 }; // default: newest first

  // Apply filter
  switch (filter) {
    case "used":
      query.isUsed = true;
      break;
    case "unused":
      query.isUsed = false;
      break;
    case "expired":
      query.expiresAt = { $lte: new Date() };
      break;
    case "expiringSoon":
      const days = 7;
      query.isUsed = false;
      query.expiresAt = {
        $lte: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
        $gte: new Date(),
      };
      break;
    case "all":
    default:
      break;
  }

  // Apply sorting
  if (sort === "highValue") {
    sortOrder = { credits: -1 }; // highest credits first
  } else if (sort === "lowValue") {
    sortOrder = { credits: 1 }; // lowest credits first
  }

  const redeemCodes = await RedeemCode.find(query).sort(sortOrder);

  return res
    .status(200)
    .json(
      new apiResponse(200, redeemCodes, "Redeem codes fetched successfully")
    );
});

// Deletes multiple redeem codes at once using an array of IDs.
// Validates each ID before deletion and removes all matching codes in a single DB operation.
const deleteBulkRedeemCodes = asyncHandler(async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    throw new apiError(400, "Provide an array of redeem code IDs to delete");
  }

  const invalidIds = ids.filter((id) => !mongoose.Types.ObjectId.isValid(id));
  if (invalidIds.length > 0) {
    throw new apiError(400, `Invalid ID(s): ${invalidIds.join(", ")}`);
  }

  const result = await RedeemCode.deleteMany({ _id: { $in: ids } });

  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        { deletedCount: result.deletedCount },
        `${result.deletedCount} redeem code(s) deleted successfully`
      )
    );
});

export {
  createRedeemCode,
  getRedeemCodeInfo,
  updateRedeemCode,
  deleteRedeemCode,
  generateBulkRedeemCodes,
  getAllRedeemCodes,
  deleteBulkRedeemCodes,
};
