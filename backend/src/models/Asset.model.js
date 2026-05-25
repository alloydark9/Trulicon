import mongoose from "mongoose";
import { randomString } from "../utils/helpers.js";


const assetSchema = new mongoose.Schema({
  type: {
    enum: ["mp4","mp3","jpg","png"],
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  name: {
    type: String,
    default: randomString(10),
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true })

export const Asset = mongoose.model("Asset", assetSchema)