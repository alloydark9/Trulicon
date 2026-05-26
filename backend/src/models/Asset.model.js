import mongoose from "mongoose";
import { randomString } from "../utils/helpers.js";

const assetSchema = new mongoose.Schema(
  {
    type: {
      enum: ["image", "video", "audio", "document", "other"],
      type: String,
      required: true,
    },
    format: {
      type: String,
      required: true,
    },
    size:{
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      default: () => randomString(10),
      minLength: 1,
      maxLength: 100 ,
    },
    originalOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    currentOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export const Asset = mongoose.model("Asset", assetSchema);
