import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.model.js";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN || "7d",
  });
};

export const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      username,
      dob,
      country,
      phone,
      gender,
      account,
      role,
    } = req.body;

    const exists = await User.findOne({
      $or: [{ email }, { phone }, { username }],
    });

    if (exists) {
      return res.status(409).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create([
      {
        name,
        username,
        email,
        phone,
        password: hashedPassword,
        country,
        dob,
        account,
        gender,
        role,
      },
    ]);

    const user = newUser[0].toObject();
    delete user.password;
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        token,
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, username, phone, password } = req.body;

    if (!password || (!email && !username && !phone)) {
      return res
        .status(400)
        .json({ message: "Please provide valid credentials" });
    }

    const query = email ? { email } : username ? { username } : { phone };
    const user = await User.findOne(query).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);
    const userData = user.toObject();
    delete userData.password;

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: userData,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};
