import mongoose from "mongoose";
import { randomString } from "../utils/helpers.js";

const vaultSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minLength: 1,
      maxLength: 30,
      default: () => randomString(8),
    },
    code: {
      type: String,
      unique: true,
      required: true,
      maxLength: 8,
      minLength: 8,
      index: true,
    },
    members: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      validate: {
        validator: function (val) {
          return val.length > 0 && val.length <= 2;
        },
        message: "Max user limit reached",
      },
    },
    assets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Asset",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 60 * 1000),
    },
    status: {
      enum: [
        "created",
        "uploaded",
        "locked",
        "preview",
        "swapping",
        "success",
        "aborted",
        "timeout",
      ],
      type: String,
      default: "created",
    },

    participants: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        uploaded: {
          type: Boolean,
          default: false,
        },
        locked: {
          type: Boolean,
          default: false,
        },
        previewed: {
          type: Boolean,
          default: false,
        },
        swapConfirmed: {
          type: Boolean,
          default: false,
        },
        aborted: {
          type: Boolean,
          default: false,
        },
      },
    ],

    swap: {
      startedAt: Date,
      completedAt: Date,
    },
  },
  { timestamps: true },
);

vaultSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Vault = mongoose.model("Vault", vaultSchema);
export default Vault;
