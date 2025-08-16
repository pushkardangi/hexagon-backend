import { Bug } from "../models/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

const createBugReport = asyncHandler(async (req, res) => {
  const {
    title,
    type,
    description,
    severity,
    environment: { browser, deviceType, os },
  } = req.body;
  const userId = req?.user?._id;

  if (
    !title ||
    !type ||
    !description ||
    !severity ||
    !browser ||
    !deviceType ||
    !os ||
    !userId
  ) {
    throw new apiError(400, "All fields are required!");
  }

  // Normalize inputs
  const payload = {
    title: title?.trim(),
    type: type?.trim(),
    description: description?.trim(),
    severity,
    environment: {
      browser: browser?.trim(),
      deviceType: deviceType?.trim(),
      os: os?.trim(),
    },
    reportedBy: userId,
  };

  const bugReport = await Bug.create(payload);

  if (!bugReport) {
    throw new apiError(500, "Failed to create bug report!");
  }

  console.log(bugReport);

  res
    .status(201)
    .json(new apiResponse(201, bugReport, "Bug reported successfully."));
});

export { createBugReport };
