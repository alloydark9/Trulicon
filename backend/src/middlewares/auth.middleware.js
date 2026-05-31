// middlewares/auth.middleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import {JWT_SECRET} from "../config/env.js";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token, access denied" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user)
      return res.status(401).json({ message: "User no longer exists" });

    req.user = user;
    next();
  } catch (error) {

    next(error);
  }
};

export default authMiddleware;