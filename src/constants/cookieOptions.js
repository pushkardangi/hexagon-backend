const accessTokenCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "None",
  path: "/api"
};

const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "None",
  path: "/api/v1/auth/renew-tokens"
};

export {
  accessTokenCookieOptions,
  refreshTokenCookieOptions
};