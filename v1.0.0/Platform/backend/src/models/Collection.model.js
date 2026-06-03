 import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      minLength: 2,
      maxLength: 50,
    },
    description:{
      type: String,
      maxLength: 200,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type:{
      enum:["private","public"],
      type: String,
      default: "private",
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true },
);


const Collection = mongoose.model("Collection", collectionSchema);
export default Collection;
