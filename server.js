// import "express-async-errors";
// import dotenv from "dotenv";
// dotenv.config();

// import app from "./src/app.js";

// const port = process.env.PORT || 4000;

// app.listen(port, () => {
//   console.log(`Server listening on (env: ${process.env.NODE_ENV})`);
// });

import "express-async-errors";
import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";

const port = process.env.PORT || 4000;

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port} in ${process.env.NODE_ENV} mode`);
});
