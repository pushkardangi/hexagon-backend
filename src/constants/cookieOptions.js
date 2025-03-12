const accessTokenCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "None",
  path: "/api",
  maxAge: 60 * 60 * 1000, // 1 hour
};

const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "None",
  path: "/api/v1/auth/renew-tokens",
  maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days
};

export {
  accessTokenCookieOptions,
  refreshTokenCookieOptions
};