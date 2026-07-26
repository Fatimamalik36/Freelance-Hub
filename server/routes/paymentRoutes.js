const express = require("express");
const router = express.Router();
const {
  createPayment,
  confirmPayment,
  getPaymentHistory,
} = require("../controllers/paymentController");
const { protect, authorize } = require("../middleware/auth");

router.post("/create", protect, authorize("client"), createPayment);
router.put("/:id/confirm", protect, authorize("client"), confirmPayment);
router.get("/history", protect, getPaymentHistory);

module.exports = router;
