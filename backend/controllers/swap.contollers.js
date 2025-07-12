
import Swap from "../models/swapRequest.models.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";

const MAX_PENDING_OUTGOING = 5;
const SWAP_POPULATE_OPTS = [
  { path: "offeredBy", select: "name profileIMG" },
  { path: "requestedFrom", select: "name profileIMG" },
];

export const createSwap = async (req, res) => {
  try {
    const { requestedFromId, offeredSkill, wantedSkill } = req.body;

    if (!requestedFromId || !offeredSkill || !wantedSkill) {
      throw new apiError("All fields are required", 400);
    }

    if (requestedFromId === req.User._id.toString()) {
      throw new apiError("Cannot request swap with yourself", 400);
    }

    const pendingCount = await Swap.countDocuments({
      offeredBy: req.User._id,
      status: "pending",
    });

    if (pendingCount >= MAX_PENDING_OUTGOING) {
      throw new apiError("Too many pending requests", 400);
    }

    const swap = await Swap.create({
      offeredBy: req.User._id,
      requestedFrom: requestedFromId,
      offeredSkill,
      wantedSkill,
    });

    await swap.populate(SWAP_POPULATE_OPTS);

    return res.status(201).json(new apiResponse(201, "Swap request created", swap));
  } catch (err) {
    throw new apiError("Failed to create swap", 500, err);
  }
};

// List swaps involving the current user
export const listMySwaps = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = {
      $or: [{ offeredBy: req.User._id }, { requestedFrom: req.User._id }],
    };

    if (status) filter.status = status;

    const swaps = await Swap.find(filter)
      .sort({ updatedAt: -1 })
      .populate(SWAP_POPULATE_OPTS)
      .lean();

    return res.status(200).json(new apiResponse(200, "Swaps fetched", swaps));
  } catch (err) {
    throw new apiError("Failed to fetch swaps", 500, err);
  }
};

// Accept or reject a swap
export const respondToSwap = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body;

    if (!["accept", "reject"].includes(action)) {
      throw new apiError("Invalid action", 400);
    }

    const swap = await Swap.findById(id);
    if (!swap) throw new apiError("Swap not found", 404);

    if (swap.requestedFrom.toString() !== req.User._id.toString()) {
      throw new apiError("Not authorized", 403);
    }

    if (swap.status !== "pending") {
      throw new apiError("Swap already responded", 400);
    }

    swap.status = action === "accept" ? "accepted" : "rejected";
    await swap.save();
    await swap.populate(SWAP_POPULATE_OPTS);

    return res.status(200).json(new apiResponse(200, `Swap ${action}ed`, swap));
  } catch (err) {
    throw new apiError("Failed to respond to swap", 500, err);
  }
};

// Cancel a pending swap
export const cancelSwap = async (req, res) => {
  try {
    const { id } = req.params;

    const swap = await Swap.findById(id);
    if (!swap) throw new apiError("Swap not found", 404);

    if (swap.offeredBy.toString() !== req.User._id.toString()) {
      throw new apiError("Not authorized", 403);
    }

    if (swap.status !== "pending") {
      throw new apiError("Only pending swaps can be cancelled", 400);
    }

    swap.status = "cancelled";
    await swap.save();
    await swap.populate(SWAP_POPULATE_OPTS);

    return res.status(200).json(new apiResponse(200, "Swap cancelled", swap));
  } catch (err) {
    throw new apiError("Failed to cancel swap", 500, err);
  }
};
