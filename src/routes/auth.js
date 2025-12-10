import express from "express";
import { validateBody } from "../middleware/validateMiddleware.js";
import {
  signUp,
  login,
  refreshToken,
  logout,
} from "../controllers/authController.js";
import { loginSchema, signUpSchema } from "../utils/schema.js";

const router = express.Router();

router.post("/signup", validateBody(signUpSchema), signUp);
router.post("/login", validateBody(loginSchema), login);
router.post("/refresh", refreshToken);
router.post("/logout", logout);

export default router;
