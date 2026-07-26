const express = require("express");
const router = express.Router();
const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyJobs,
  hireFreelancer,
} = require("../controllers/jobController");
const { protect, authorize } = require("../middleware/auth");

router.get("/my-jobs", protect, authorize("client"), getMyJobs);

router.route("/").get(getJobs).post(protect, authorize("client"), createJob);

router
  .route("/:id")
  .get(getJobById)
  .put(protect, authorize("client"), updateJob)
  .delete(protect, authorize("client"), deleteJob);

router.put(
  "/:id/hire/:freelancerId",
  protect,
  authorize("client"),
  hireFreelancer
);

module.exports = router;
