import Rating from "../models/ratings.models.js";
import SwapRequest from "../models/swapRequest.models.js";
import User from "../models/user.model.js"; 

export const createRating = async (req, res) => {
  try {
    const { swap, ratee, score, comment } = req.body;
    const rater = req.user._id; 

    if (rater.toString() === ratee.toString()) {
      return res.status(400).json({ message: "You can't rate yourself." });
    }
    const existingSwap = await SwapRequest.findById(swap);
    if (!existingSwap) {
      return res.status(404).json({ message: "Swap not found." });
    }

    if (
      !(
        existingSwap.status === "accepted" ||
        existingSwap.status === "completed"
      )
    ) {
      return res
        .status(400)
        .json({ message: "Swap must be accepted or completed to rate." });
    }

    const alreadyRated = await Rating.findOne({ swap });
    if (alreadyRated) {
      return res
        .status(400)
        .json({ message: "This swap has already been rated." });
    }

    const newRating = new Rating({
      swap,
      rater,
      ratee,
      score,
      comment,
    });

    await newRating.save();
    res.status(201).json({ message: "Rating submitted", rating: newRating });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getRatingsForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const ratings = await Rating.find({ ratee: userId })
      .populate("rater", "name profilePhoto")
      .sort({ createdAt: -1 });

    res.json(ratings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getRatingBySwap = async (req, res) => {
  try {
    const { swapId } = req.params;
    const rating = await Rating.findOne({ swap: swapId }).populate(
      "rater",
      "name"
    );

    if (!rating) {
      return res.status(404).json({ message: "Rating not found" });
    }

    res.json(rating);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
