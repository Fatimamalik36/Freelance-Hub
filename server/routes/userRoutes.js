const express = require("express");
const router = express.Router();
const {
  getFreelancers,
  getUserProfile,
  updateProfile,
  updateProfileImage,
  addPortfolio,
  deletePortfolio,
  addExperience,
  deleteExperience,
  addEducation,
  deleteEducation,
  toggleSaveJob,
  getSavedJobs,
  getDashboardStats,
} = require("../controllers/userController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.get("/freelancers", getFreelancers);
router.get("/saved-jobs", protect, getSavedJobs);
router.get("/dashboard-stats", protect, getDashboardStats);

router.put("/profile", protect, updateProfile);
router.put(
  "/profile-image",
  protect,
  upload.single("profileImage"),
  updateProfileImage
);

router.post("/portfolio", protect, upload.single("image"), addPortfolio);
router.delete("/portfolio/:itemId", protect, deletePortfolio);

router.post("/experience", protect, addExperience);
router.delete("/experience/:itemId", protect, deleteExperience);

router.post("/education", protect, addEducation);
router.delete("/education/:itemId", protect, deleteEducation);

router.put("/save-job/:jobId", protect, toggleSaveJob);

router.get("/:id", getUserProfile);

module.exports = router;
