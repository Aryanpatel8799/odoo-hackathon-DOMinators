import mongoose from "mongoose";

const STATUS = ["pending", "accepted", "rejected", "cancelled", "completed"];

const swapRequestSchema = new mongoose.Schema(
  {
    offeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    requestedFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    offeredSkill: { type: String, required: true },
    wantedSkill: { type: String, required: true },
    status: { type: String, enum: STATUS, default: "pending", index: true },
  },
  { timestamps: true }
);

/* Prevent duplicate *pending* requests for same pair & skills */
swapRequestSchema.index(
  {
    offeredBy: 1,
    requestedFrom: 1,
    offeredSkill: 1,
    wantedSkill: 1,
    status: 1,
  },
  {
    unique: true,
    partialFilterExpression: { status: "pending" },
    name: "unique_pending_swap",
  }
);

export default mongoose.model("SwapRequest", swapRequestSchema);
