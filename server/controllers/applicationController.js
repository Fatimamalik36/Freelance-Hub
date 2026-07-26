const asyncHandler = require("express-async-handler");
const Application = require("../models/Application");
const Job = require("../models/Job");
const createNotification = require("../utils/createNotification");

// @desc    Apply to a job
// @route   POST /api/applications/:jobId
// @access  Private (freelancer)
const applyToJob = asyncHandler(async (req, res) => {
  const { proposal, bidAmount, duration } = req.body;
  const job = await Job.findById(req.params.jobId);

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  if (job.status !== "open") {
    res.status(400);
    throw new Error("This job is no longer accepting applications");
  }

  const existing = await Application.findOne({
    job: job._id,
    freelancer: req.user._id,
  });

  if (existing) {
    res.status(400);
    throw new Error("You have already applied to this job");
  }

  const application = await Application.create({
    job: job._id,
    freelancer: req.user._id,
    proposal,
    bidAmount,
    duration,
  });

  job.applicantsCount += 1;
  await job.save();

  await createNotification({
    io: req.app.get("io"),
    onlineUsers: req.app.get("onlineUsers"),
    user: job.client,
    type: "job_application",
    message: `${req.user.name} applied to your job "${job.title}"`,
    link: `/jobs/${job._id}`,
  });

  res.status(201).json({ success: true, application });
});

// @desc    Get applications for a job (client view)
// @route   GET /api/applications/job/:jobId
// @access  Private (job owner)
const getApplicationsForJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.jobId);

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  if (job.client.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized");
  }

  const applications = await Application.find({ job: req.params.jobId })
    .populate("freelancer", "name profileImage title rating numReviews skills")
    .sort({ createdAt: -1 });

  res.json({ success: true, applications });
});

// @desc    Get applications made by logged in freelancer
// @route   GET /api/applications/my-applications
// @access  Private (freelancer)
const getMyApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ freelancer: req.user._id })
    .populate({
      path: "job",
      populate: { path: "client", select: "name profileImage" },
    })
    .sort({ createdAt: -1 });

  res.json({ success: true, applications });
});

// @desc    Update application status (accept/reject)
// @route   PUT /api/applications/:id/status
// @access  Private (job owner)
const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const application = await Application.findById(req.params.id).populate("job");

  if (!application) {
    res.status(404);
    throw new Error("Application not found");
  }

  if (application.job.client.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized");
  }

  application.status = status;
  await application.save();

  await createNotification({
    io: req.app.get("io"),
    onlineUsers: req.app.get("onlineUsers"),
    user: application.freelancer,
    type: status === "accepted" ? "application_accepted" : "application_rejected",
    message: `Your application for "${application.job.title}" was ${status}`,
    link: `/jobs/${application.job._id}`,
  });

  res.json({ success: true, application });
});

// @desc    Withdraw application
// @route   DELETE /api/applications/:id
// @access  Private (applicant)
const withdrawApplication = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id);

  if (!application) {
    res.status(404);
    throw new Error("Application not found");
  }

  if (application.freelancer.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized");
  }

  await application.deleteOne();
  await Job.findByIdAndUpdate(application.job, { $inc: { applicantsCount: -1 } });

  res.json({ success: true, message: "Application withdrawn" });
});

module.exports = {
  applyToJob,
  getApplicationsForJob,
  getMyApplications,
  updateApplicationStatus,
  withdrawApplication,
};
