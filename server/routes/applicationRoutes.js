const express = require("express");
const router = express.Router();
const {
  applyToJob,
  getApplicationsForJob,
  getMyApplications,
  updateApplicationStatus,
  withdrawApplication,
} = require("../controllers/applicationController");
const { protect, authorize } = require("../middleware/auth");

router.get(
  "/my-applications",
  protect,
  authorize("freelancer"),
  getMyApplications
);
router.get("/job/:jobId", protect, authorize("client"), getApplicationsForJob);
router.post("/:jobId", protect, authorize("freelancer"), applyToJob);
router.put("/:id/status", protect, authorize("client"), updateApplicationStatus);
router.delete("/:id", protect, authorize("freelancer"), withdrawApplication);

module.exports = router;
