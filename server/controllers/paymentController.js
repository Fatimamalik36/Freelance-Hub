const asyncHandler = require("express-async-handler");
const crypto = require("crypto");
const Payment = require("../models/Payment");
const Job = require("../models/Job");
const createNotification = require("../utils/createNotification");

// NOTE: This is a structural Stripe-style integration. To go live, install the
// `stripe` package, initialize it with STRIPE_SECRET_KEY, and replace the mock
// `transactionId` generation with a real PaymentIntent / Checkout Session call.

// @desc    Create a payment (checkout) for a job/contract
// @route   POST /api/payments/create
// @access  Private (client)
const createPayment = asyncHandler(async (req, res) => {
  const { jobId, amount } = req.body;

  const job = await Job.findById(jobId);
  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  if (job.client.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized");
  }

  // Mock transaction id — replace with Stripe PaymentIntent id in production
  const transactionId = `txn_${crypto.randomBytes(8).toString("hex")}`;

  const payment = await Payment.create({
    user: req.user._id,
    job: jobId,
    freelancer: job.hiredFreelancer,
    amount,
    status: "pending",
    transactionId,
  });

  res.status(201).json({
    success: true,
    payment,
    clientSecret: `mock_secret_${transactionId}`,
  });
});

// @desc    Confirm a payment (simulate webhook success)
// @route   PUT /api/payments/:id/confirm
// @access  Private (client)
const confirmPayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id);

  if (!payment) {
    res.status(404);
    throw new Error("Payment not found");
  }

  payment.status = "completed";
  await payment.save();

  if (payment.freelancer) {
    await createNotification({
      io: req.app.get("io"),
      onlineUsers: req.app.get("onlineUsers"),
      user: payment.freelancer,
      type: "payment",
      message: `You received a payment of $${payment.amount}`,
      link: "/dashboard",
    });
  }

  res.json({ success: true, payment });
});

// @desc    Get payment history for logged in user
// @route   GET /api/payments/history
// @access  Private
const getPaymentHistory = asyncHandler(async (req, res) => {
  const query =
    req.user.role === "client"
      ? { user: req.user._id }
      : { freelancer: req.user._id };

  const payments = await Payment.find(query)
    .populate("job", "title")
    .populate("user", "name")
    .populate("freelancer", "name")
    .sort({ createdAt: -1 });

  res.json({ success: true, payments });
});

module.exports = { createPayment, confirmPayment, getPaymentHistory };
