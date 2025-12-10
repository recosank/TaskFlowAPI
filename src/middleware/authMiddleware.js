import { verifyAccessToken } from "../utils/jwt.js";
import { HttpError } from "../utils/errorHandler.js";

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new HttpError(401, "Authorization header not found");
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer")
      throw new HttpError(401, "Invalid Authorization header format");
    const token = parts[1];
    let payload;
    try {
      payload = verifyAccessToken(token);
    } catch (err) {
      throw new HttpError(401, "Invalid or expired token");
    }

    req.user = { id: payload.sub, email: payload.email };

    next();
  } catch (err) {
    next(err);
  }
}
