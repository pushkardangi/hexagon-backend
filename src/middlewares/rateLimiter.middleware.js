import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 min
  max: 100,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
  headers: true,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});
