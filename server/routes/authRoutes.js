const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  logout,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

module.exports = router;
