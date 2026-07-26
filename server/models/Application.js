const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    proposal: {
      type: String,
      required: [true, "Proposal is required"],
    },
    bidAmount: {
      type: Number,
      required: true,
    },
    duration: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

applicationSchema.index({ job: 1, freelancer: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);
