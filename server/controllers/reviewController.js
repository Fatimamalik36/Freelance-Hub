const asyncHandler = require("express-async-handler");
const Review = require("../models/Review");
const User = require("../models/User");
const createNotification = require("../utils/createNotification");

// @desc    Create a review for a freelancer
// @route   POST /api/reviews/:freelancerId
// @access  Private (client)
const createReview = asyncHandler(async (req, res) => {
  const { rating, comment, jobId } = req.body;
  const freelancerId = req.params.freelancerId;

  const review = await Review.create({
    reviewer: req.user._id,
    freelancer: freelancerId,
    job: jobId,
    rating,
    comment,
  });

  const reviews = await Review.find({ freelancer: freelancerId });
  const avgRating =
    reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

  await User.findByIdAndUpdate(freelancerId, {
    rating: avgRating.toFixed(1),
    numReviews: reviews.length,
  });

  await createNotification({
    io: req.app.get("io"),
    onlineUsers: req.app.get("onlineUsers"),
    user: freelancerId,
    type: "review",
    message: `You received a new ${rating}-star review`,
    link: `/freelancers/${freelancerId}`,
  });

  res.status(201).json({ success: true, review });
});

// @desc    Get reviews for a freelancer
// @route   GET /api/reviews/:freelancerId
// @access  Public
const getReviewsForFreelancer = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ freelancer: req.params.freelancerId })
    .populate("reviewer", "name profileImage")
    .sort({ createdAt: -1 });

  res.json({ success: true, reviews });
});

module.exports = { createReview, getReviewsForFreelancer };
