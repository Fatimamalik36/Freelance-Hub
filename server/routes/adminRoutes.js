const express = require("express");
const router = express.Router();
const {
  getAnalytics,
  getAllUsers,
  toggleBlockUser,
  deleteUser,
  getAllJobs,
  deleteJobAdmin,
} = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/auth");

router.use(protect, authorize("admin"));

router.get("/analytics", getAnalytics);
router.get("/users", getAllUsers);
router.put("/users/:id/toggle-block", toggleBlockUser);
router.delete("/users/:id", deleteUser);
router.get("/jobs", getAllJobs);
router.delete("/jobs/:id", deleteJobAdmin);

module.exports = router;
