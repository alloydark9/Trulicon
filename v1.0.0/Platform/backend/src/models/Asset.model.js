import mongoose from "mongoose";

const assetSchema = new mongoose.Schema(
  {
    type: {
      enum: ["image", "video", "audio", "document", "money", "other"],
      type: String,
      required: true,
    },
    format: {
      type: String,
      required: true,
    },
    size:{
      type: Number,
      required: true,
    },
    localPath:{
      type: String,
      default: null,
    },
    url: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      minLength: 1,
      maxLength: 100 ,
      required: true
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
    vault:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vault",
      // required: true,
    },
    status:{
      enum: ["uploaded", "locked", "swapped"],
      type: String,
      default: "uploaded"
    }
  },
  { timestamps: true },
);

export const Asset = mongoose.model("Asset", assetSchema);
export default Asset;