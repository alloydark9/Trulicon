import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minLength: 2,
      maxLength: 50,
      default: "Trulicon User",
      index: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      minLength: 4,
      maxLength: 20,
      index: true,
    },
    bio:{
      type: String,
      maxLength: 160,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      minLength: 10,
      maxLength: 15,
    },
    country: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
      maxLength: 100,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    account: {
      type: String,
      enum: ["freelancer", "client", "company"],
      default: "client",
    },
    role: {
      type: String,
      enum: ["owner", "admin", "member"],
      default: "member",
    },
    killToken: {
      type: Number,
      default: 3,
    },
    vaults: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vault",
      },
    ],
    mates: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    branches: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch",
      }
    ],
    otp: {
      code: {
        type: Number,
      },
      expiresAt: {
        type: Date,
      },
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
