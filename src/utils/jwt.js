import jwt from "jsonwebtoken";
import { add } from "date-fns";

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES_IN || "15m";
const REFRESH_EXPIRES_DAYS = Number(
  process.env.REFRESH_TOKEN_EXPIRES_IN_DAYS || 7
);

export function signAccessToken(payload) {
  if (!ACCESS_SECRET) throw new Error("ACCESS_TOKEN_SECRET not set");
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES });
}

export function verifyAccessToken(token) {
  if (!token) throw new Error("No access token provided");
  return jwt.verify(token, ACCESS_SECRET);
}

export function signRefreshToken(payload) {
  if (!REFRESH_SECRET) throw new Error("REFRESH_TOKEN_SECRET not set");
  return jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: `${REFRESH_EXPIRES_DAYS}d`,
  });
}

export function verifyRefreshToken(token) {
  if (!token) throw new Error("No refresh token provided");
  return jwt.verify(token, REFRESH_SECRET);
}

export function refreshTokenExpiryDate() {
  return add(new Date(), { days: REFRESH_EXPIRES_DAYS });
}
