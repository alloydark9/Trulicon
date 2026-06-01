import { Router } from "express";
import {
  register,
  login,
  logout,
  getCurrentUser,
} from "../controllers/auth.controller.js";
import protect from "../middlewares/auth.middleware.js";

const authRouter = Router();

// Path: /api/v1/auth/sign-up
authRouter.post("/sign-up", register);
// Path: /api/v1/auth/sign-in
authRouter.post("/sign-in", login);
// Path: /api/v1/auth/sign-out
authRouter.post("/sign-out", logout);
// Path: /api/v1/auth/me
authRouter.get("/me", protect, getCurrentUser);

export default authRouter;
