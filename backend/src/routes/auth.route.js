import { Router } from "express";
import { register, login, logout } from "../controllers/auth.controller.js";

const authRouter = Router();

// Path: /api/v1/auth/sign-up
authRouter.post("/sign-up", register);
// Path: /api/v1/auth/sign-in
authRouter.post("/sign-in", login);
// Path: /api/v1/auth/sign-out
authRouter.post("/sign-out", logout);

export default authRouter;
