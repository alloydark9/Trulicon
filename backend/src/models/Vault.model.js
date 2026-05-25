import mongoose from "mongoose"; // 1. Fixed typo here ("momgoose" -> "mongoose")

const vaultSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 1,
    maxLength: 30,
    default: "NewVault",
  },
  code: {
    type: String,
    unique: true,
    required: true,
    maxLength: 8,
    minLength: 8,
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
        return val.length <= 2;
      },
      message: "Max user limit reached",
    },
  },
  assets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asset",
    }
  ]
});

export const Vault = mongoose.model("Vault", vaultSchema);
