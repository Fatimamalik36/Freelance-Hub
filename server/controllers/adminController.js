const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Job = require("../models/Job");
const Payment = require("../models/Payment");
const Application = require("../models/Application");

// @desc    Get platform overview analytics
// @route   GET /api/admin/analytics
// @access  Private (admin)
const getAnalytics = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalClients,
    totalFreelancers,
    totalJobs,
    openJobs,
    completedJobs,
    totalApplications,
    payments,
  ] = await Promise.all([
    User.countDocuments({ role: { $ne: "admin" } }),
    User.countDocuments({ role: "client" }),
    User.countDocuments({ role: "freelancer" }),
    Job.countDocuments(),
    Job.countDocuments({ status: "open" }),
    Job.countDocuments({ status: "completed" }),
    Application.countDocuments(),
    Payment.find({ status: "completed" }),
  ]);

  const totalRevenue = payments.reduce((acc, p) => acc + p.amount, 0);

  res.json({
    success: true,
    analytics: {
      totalUsers,
      totalClients,
      totalFreelancers,
      totalJobs,
      openJobs,
      completedJobs,
      totalApplications,
      totalRevenue,
      totalTransactions: payments.length,
    },
  });
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (admin)
const getAllUsers = asyncHandler(async (req, res) => {
  const { role, search, page = 1, limit = 20 } = req.query;
  const query = {};
  if (role) query.role = role;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [users, total] = await Promise.all([
    User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    User.countDocuments(query),
  ]);

  res.json({
    success: true,
    users,
    total,
    pages: Math.ceil(total / limit),
    currentPage: Number(page),
  });
});

// @desc    Block / unblock a user
// @route   PUT /api/admin/users/:id/toggle-block
// @access  Private (admin)
const toggleBlockUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.isBlocked = !user.isBlocked;
  await user.save();

  res.json({ success: true, user });
});

// @desc    Delete a user account
// @route   DELETE /api/admin/users/:id
// @access  Private (admin)
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  await user.deleteOne();
  res.json({ success: true, message: "User deleted successfully" });
});

// @desc    Get all jobs (admin)
// @route   GET /api/admin/jobs
// @access  Private (admin)
const getAllJobs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const [jobs, total] = await Promise.all([
    Job.find()
      .populate("client", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Job.countDocuments(),
  ]);

  res.json({
    success: true,
    jobs,
    total,
    pages: Math.ceil(total / limit),
    currentPage: Number(page),
  });
});

// @desc    Delete a job (admin)
// @route   DELETE /api/admin/jobs/:id
// @access  Private (admin)
const deleteJobAdmin = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  await job.deleteOne();
  res.json({ success: true, message: "Job deleted successfully" });
});

module.exports = {
  getAnalytics,
  getAllUsers,
  toggleBlockUser,
  deleteUser,
  getAllJobs,
  deleteJobAdmin,
};
