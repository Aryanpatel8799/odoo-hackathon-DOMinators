
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

    // Add direction information to each swap
    const swapsWithDirection = swaps.map(swap => {
      const direction = swap.offeredBy._id === req.User._id ? 'outgoing' : 'incoming';
      console.log('Swap direction calculation:', {
        swapId: swap._id,
        offeredBy: swap.offeredBy._id,
        requestedFrom: swap.requestedFrom._id,
        currentUser: req.User._id,
        direction
      });
      return {
        ...swap,
        direction
      };
    });

    return res.status(200).json(new apiResponse(200, "Swaps fetched", swapsWithDirection));
  } catch (err) {
    throw new apiError("Failed to fetch swaps", 500, err);
  }
};

// Accept or reject a swap
export const respondToSwap = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body;

    console.log('Respond to swap request:', {
      swapId: id,
      action,
      currentUserId: req.User._id
    });

    if (!["accept", "reject"].includes(action)) {
      throw new apiError("Invalid action", 400);
    }

    const swap = await Swap.findById(id);
    if (!swap) throw new apiError("Swap not found", 404);

    console.log('Swap details:', {
      swapId: swap._id,
      offeredBy: swap.offeredBy,
      requestedFrom: swap.requestedFrom,
      status: swap.status,
      currentUser: req.User._id
    });

    // Only the requestedFrom user can accept/reject the swap
    if (swap.requestedFrom.toString() !== req.User._id.toString()) {
      console.log('Authorization failed:', {
        swapRequestedFrom: swap.requestedFrom.toString(),
        currentUser: req.User._id.toString(),
        match: swap.requestedFrom.toString() === req.User._id.toString()
      });
      throw new apiError("Not authorized - only the person who was requested from can accept/reject this swap", 403);
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

// Mark a swap as completed
export const completeSwap = async (req, res) => {
  try {
    const { id } = req.params;

    const swap = await Swap.findById(id);
    if (!swap) throw new apiError("Swap not found", 404);

    // Check if user is one of the participants
    if (swap.offeredBy.toString() !== req.User._id.toString() && 
        swap.requestedFrom.toString() !== req.User._id.toString()) {
      throw new apiError("Not authorized", 403);
    }

    if (swap.status !== "accepted") {
      throw new apiError("Only accepted swaps can be marked as completed", 400);
    }

    swap.status = "completed";
    await swap.save();
    await swap.populate(SWAP_POPULATE_OPTS);

    return res.status(200).json(new apiResponse(200, "Swap marked as completed", swap));
  } catch (err) {
    throw new apiError("Failed to complete swap", 500, err);
  }
};
