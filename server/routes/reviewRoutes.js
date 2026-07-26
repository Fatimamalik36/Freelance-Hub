const express = require("express");
const router = express.Router();
const {
  createReview,
  getReviewsForFreelancer,
} = require("../controllers/reviewController");
const { protect, authorize } = require("../middleware/auth");

router
  .route("/:freelancerId")
  .get(getReviewsForFreelancer)
  .post(protect, authorize("client"), createReview);

module.exports = router;
