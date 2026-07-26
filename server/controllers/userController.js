const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");
const Payment = require("../models/Payment");

// @desc    Get all freelancers with filters
// @route   GET /api/users/freelancers
// @access  Public
const getFreelancers = asyncHandler(async (req, res) => {
  const { search, skill, minRate, maxRate, page = 1, limit = 12 } = req.query;

  const query = { role: "freelancer", isBlocked: false };

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { title: { $regex: search, $options: "i" } },
      { skills: { $regex: search, $options: "i" } },
    ];
  }

  if (skill) query.skills = { $regex: skill, $options: "i" };

  if (minRate || maxRate) {
    query.hourlyRate = {};
    if (minRate) query.hourlyRate.$gte = Number(minRate);
    if (maxRate) query.hourlyRate.$lte = Number(maxRate);
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [freelancers, total] = await Promise.all([
    User.find(query)
      .select("-password -resetPasswordToken -resetPasswordExpire")
      .sort({ rating: -1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    User.countDocuments(query),
  ]);

  res.json({
    success: true,
    count: freelancers.length,
    total,
    pages: Math.ceil(total / limit),
    currentPage: Number(page),
    freelancers,
  });
});

// @desc    Get single user public profile
// @route   GET /api/users/:id
// @access  Public
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select(
    "-password -resetPasswordToken -resetPasswordExpire"
  );

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json({ success: true, user });
});

// @desc    Update own profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const fields = [
    "name",
    "title",
    "bio",
    "location",
    "phone",
    "hourlyRate",
    "skills",
  ];

  fields.forEach((field) => {
    if (req.body[field] !== undefined) user[field] = req.body[field];
  });

  const updated = await user.save();
  res.json({ success: true, user: updated });
});

// @desc    Upload / update profile image
// @route   PUT /api/users/profile-image
// @access  Private
const updateProfileImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("Please upload an image");
  }

  const user = await User.findById(req.user._id);
  user.profileImage = `/uploads/${req.file.filename}`;
  await user.save();

  res.json({ success: true, profileImage: user.profileImage });
});

// @desc    Add portfolio item
// @route   POST /api/users/portfolio
// @access  Private (freelancer)
const addPortfolio = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { title, description, link } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : "";

  user.portfolio.push({ title, description, link, image });
  await user.save();

  res.status(201).json({ success: true, portfolio: user.portfolio });
});

// @desc    Delete portfolio item
// @route   DELETE /api/users/portfolio/:itemId
// @access  Private (freelancer)
const deletePortfolio = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.portfolio = user.portfolio.filter(
    (item) => item._id.toString() !== req.params.itemId
  );
  await user.save();
  res.json({ success: true, portfolio: user.portfolio });
});

// @desc    Add experience
// @route   POST /api/users/experience
// @access  Private
const addExperience = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.experience.push(req.body);
  await user.save();
  res.status(201).json({ success: true, experience: user.experience });
});

// @desc    Delete experience
// @route   DELETE /api/users/experience/:itemId
// @access  Private
const deleteExperience = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.experience = user.experience.filter(
    (item) => item._id.toString() !== req.params.itemId
  );
  await user.save();
  res.json({ success: true, experience: user.experience });
});

// @desc    Add education
// @route   POST /api/users/education
// @access  Private
const addEducation = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.education.push(req.body);
  await user.save();
  res.status(201).json({ success: true, education: user.education });
});

// @desc    Delete education
// @route   DELETE /api/users/education/:itemId
// @access  Private
const deleteEducation = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.education = user.education.filter(
    (item) => item._id.toString() !== req.params.itemId
  );
  await user.save();
  res.json({ success: true, education: user.education });
});

// @desc    Save / unsave a job
// @route   PUT /api/users/save-job/:jobId
// @access  Private (freelancer)
const toggleSaveJob = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const jobId = req.params.jobId;

  const alreadySaved = user.savedJobs.some((id) => id.toString() === jobId);

  if (alreadySaved) {
    user.savedJobs = user.savedJobs.filter((id) => id.toString() !== jobId);
  } else {
    user.savedJobs.push(jobId);
  }

  await user.save();
  res.json({ success: true, saved: !alreadySaved, savedJobs: user.savedJobs });
});

// @desc    Get saved jobs
// @route   GET /api/users/saved-jobs
// @access  Private (freelancer)
const getSavedJobs = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: "savedJobs",
    populate: { path: "client", select: "name profileImage" },
  });
  res.json({ success: true, savedJobs: user.savedJobs });
});

// @desc    Get dashboard stats for current user
// @route   GET /api/users/dashboard-stats
// @access  Private
const getDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  if (req.user.role === "client") {
    const [jobsPosted, activeContracts, completedProjects, pendingPayments] =
      await Promise.all([
        Job.countDocuments({ client: userId }),
        Job.countDocuments({ client: userId, status: "in-progress" }),
        Job.countDocuments({ client: userId, status: "completed" }),
        Payment.countDocuments({ user: userId, status: "pending" }),
      ]);

    return res.json({
      success: true,
      stats: {
        jobsPosted,
        activeContracts,
        completedProjects,
        pendingPayments,
      },
    });
  }

  const [jobsApplied, activeContracts, completedProjects, pendingPayments] =
    await Promise.all([
      Application.countDocuments({ freelancer: userId }),
      Job.countDocuments({ hiredFreelancer: userId, status: "in-progress" }),
      Job.countDocuments({ hiredFreelancer: userId, status: "completed" }),
      Payment.countDocuments({ freelancer: userId, status: "pending" }),
    ]);

  res.json({
    success: true,
    stats: {
      jobsApplied,
      activeContracts,
      completedProjects,
      pendingPayments,
    },
  });
});

module.exports = {
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
};
