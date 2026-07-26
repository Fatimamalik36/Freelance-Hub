const asyncHandler = require("express-async-handler");
const Job = require("../models/Job");
const Application = require("../models/Application");
const createNotification = require("../utils/createNotification");

// @desc    Create a job
// @route   POST /api/jobs
// @access  Private (client)
const createJob = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    category,
    skillsRequired,
    budgetType,
    budget,
    duration,
    experienceLevel,
  } = req.body;

  if (!title || !description || !category || !budget) {
    res.status(400);
    throw new Error("Please fill in all required fields");
  }

  const job = await Job.create({
    title,
    description,
    category,
    skillsRequired: Array.isArray(skillsRequired)
      ? skillsRequired
      : (skillsRequired || "").split(",").map((s) => s.trim()).filter(Boolean),
    budgetType,
    budget,
    duration,
    experienceLevel,
    client: req.user._id,
  });

  res.status(201).json({ success: true, job });
});

// @desc    Get all jobs with filters
// @route   GET /api/jobs
// @access  Public
const getJobs = asyncHandler(async (req, res) => {
  const {
    search,
    category,
    budgetType,
    minBudget,
    maxBudget,
    experienceLevel,
    status = "open",
    page = 1,
    limit = 12,
  } = req.query;

  const query = {};
  if (status) query.status = status;
  if (category) query.category = category;
  if (budgetType) query.budgetType = budgetType;
  if (experienceLevel) query.experienceLevel = experienceLevel;

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { skillsRequired: { $regex: search, $options: "i" } },
    ];
  }

  if (minBudget || maxBudget) {
    query.budget = {};
    if (minBudget) query.budget.$gte = Number(minBudget);
    if (maxBudget) query.budget.$lte = Number(maxBudget);
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [jobs, total] = await Promise.all([
    Job.find(query)
      .populate("client", "name profileImage location rating")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Job.countDocuments(query),
  ]);

  res.json({
    success: true,
    count: jobs.length,
    total,
    pages: Math.ceil(total / limit),
    currentPage: Number(page),
    jobs,
  });
});

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id)
    .populate("client", "name profileImage location rating numReviews")
    .populate("hiredFreelancer", "name profileImage title");

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  res.json({ success: true, job });
});

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (job owner)
const updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  if (job.client.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to edit this job");
  }

  const fields = [
    "title",
    "description",
    "category",
    "skillsRequired",
    "budgetType",
    "budget",
    "duration",
    "experienceLevel",
    "status",
  ];

  fields.forEach((field) => {
    if (req.body[field] !== undefined) job[field] = req.body[field];
  });

  const updated = await job.save();
  res.json({ success: true, job: updated });
});

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (job owner)
const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  if (job.client.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to delete this job");
  }

  await Application.deleteMany({ job: job._id });
  await job.deleteOne();

  res.json({ success: true, message: "Job deleted successfully" });
});

// @desc    Get jobs posted by logged in client
// @route   GET /api/jobs/my-jobs
// @access  Private (client)
const getMyJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ client: req.user._id }).sort({
    createdAt: -1,
  });
  res.json({ success: true, jobs });
});

// @desc    Hire a freelancer for a job
// @route   PUT /api/jobs/:id/hire/:freelancerId
// @access  Private (client)
const hireFreelancer = asyncHandler(async (req, res, next) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  if (job.client.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized");
  }

  job.hiredFreelancer = req.params.freelancerId;
  job.status = "in-progress";
  await job.save();

  await Application.updateMany(
    { job: job._id, freelancer: { $ne: req.params.freelancerId } },
    { status: "rejected" }
  );
  await Application.updateOne(
    { job: job._id, freelancer: req.params.freelancerId },
    { status: "accepted" }
  );

  await createNotification({
    io: req.app.get("io"),
    onlineUsers: req.app.get("onlineUsers"),
    user: req.params.freelancerId,
    type: "application_accepted",
    message: `You've been hired for the job "${job.title}"`,
    link: `/jobs/${job._id}`,
  });

  res.json({ success: true, job });
});

module.exports = {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyJobs,
  hireFreelancer,
};
