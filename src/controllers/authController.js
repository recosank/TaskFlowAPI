import bcrypt from "bcrypt";
import prisma from "../prismaClient.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  refreshTokenExpiryDate,
} from "../utils/jwt.js";
import { HttpError } from "../utils/errorHandler.js";

const REFRESH_TTL_DAYS = Number(process.env.REFRESH_TOKEN_EXPIRES_IN_DAYS || 7);
const BCRYPT_ROUNDS = 12;

export async function signUp(req, res, next) {
  try {
    const { email, password, name } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new HttpError(400, "email already in use");
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const user = await prisma.user.create({
      data: { email, name, passwordHash },
    });

    const accessToken = signAccessToken({ sub: user.id, email: user.email });
    const refreshToken = signRefreshToken({ sub: user.id, email: user.email });
    const expiresAt = refreshTokenExpiryDate();
    await prisma.refreshToken.create({
      data: { token: refreshToken, userId: user.id, expiresAt },
    });
    const isProd = process.env.NODE_ENV === "production";

    res.cookie("jid", refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
      maxAge: REFRESH_TTL_DAYS * 24 * 60 * 60 * 1000,
    });
    res.status(201).json({
      accessToken,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new HttpError(401, "Invalid credentials");
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) throw new HttpError(401, "Invalid credentials");

    const accessToken = signAccessToken({ sub: user.id, email: user.email });
    const refreshToken = signRefreshToken({ sub: user.id, email: user.email });
    const expiresAt = refreshTokenExpiryDate();
    await prisma.refreshToken.create({
      data: { token: refreshToken, userId: user.id, expiresAt },
    });
    const isProd = process.env.NODE_ENV === "production";
    res.cookie("jid", refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/api/auth/refresh",
      maxAge: REFRESH_TTL_DAYS * 24 * 60 * 60 * 1000,
    });
    res.json({
      accessToken,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (err) {
    next(err);
  }
}

export async function refreshToken(req, res, next) {
  try {
    const token = req.cookies?.jid;
    if (!token) throw new HttpError(401, "No refresh token provided");

    let payload;
    try {
      payload = verifyRefreshToken(token);
    } catch (err) {
      throw new HttpError(401, "Invalid or expired refresh token");
    }

    const dbToken = await prisma.refreshToken.findUnique({ where: { token } });
    if (!dbToken || dbToken.revoked)
      throw new HttpError(401, "Refresh token revoked or not found");
    if (new Date(dbToken.expiresAt) < new Date())
      throw new HttpError(401, "Refresh token expired");

    const accessToken = signAccessToken({
      sub: payload.sub,
      email: payload.email,
    });
    res.json({ accessToken, user: { id: payload.sub, email: payload.email } });
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res, next) {
  try {
    const token = req.cookies?.jid;
    if (token) {
      await prisma.refreshToken.updateMany({
        where: { token },
        data: { revoked: true },
      });
    }
    res.clearCookie("jid", { path: "/api/auth/refresh" });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}
