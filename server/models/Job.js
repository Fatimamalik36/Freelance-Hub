const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
    },
    category: {
      type: String,
      required: true,
    },
    skillsRequired: {
      type: [String],
      default: [],
    },
    budgetType: {
      type: String,
      enum: ["fixed", "hourly"],
      default: "fixed",
    },
    budget: {
      type: Number,
      required: true,
    },
    duration: {
      type: String,
      default: "",
    },
    experienceLevel: {
      type: String,
      enum: ["entry", "intermediate", "expert"],
      default: "intermediate",
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    hiredFreelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    status: {
      type: String,
      enum: ["open", "in-progress", "completed", "cancelled"],
      default: "open",
    },
    applicantsCount: {
      type: Number,
      default: 0,
    },
    attachments: [String],
  },
  { timestamps: true }
);

jobSchema.index({ title: "text", description: "text", skillsRequired: "text" });

module.exports = mongoose.model("Job", jobSchema);
