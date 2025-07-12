import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    swap: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SwapRequest",
      required: true,
      unique: true,              // one rating per swap
    },
    rater: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ratee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    score: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, maxlength: 500 },
  },
  { timestamps: true }
);

ratingSchema.index({ ratee: 1, score: -1 });

export default mongoose.model("Rating", ratingSchema);
