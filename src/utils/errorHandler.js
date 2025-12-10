export class HttpError extends Error {
  constructor(status = 500, message = "Internal Server Error", details = null) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export function errorHandler(err, req, res, next) {
  console.error(err);

  if (err instanceof HttpError) {
    return res
      .status(err.status)
      .json({ error: err.message, details: err.details || null });
  }

  if (err?.errors && Array.isArray(err.errors)) {
    return res
      .status(400)
      .json({ error: "Validation error", details: err.errors });
  }

  if (err?.name === "JsonWebTokenError" || err?.name === "TokenExpiredError") {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  res.status(500).json({ error: err.message || "Internal Server Error" });
}
