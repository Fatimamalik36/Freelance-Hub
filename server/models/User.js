const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const experienceSchema = new mongoose.Schema(
  {
    title: String,
    company: String,
    from: String,
    to: String,
    description: String,
  },
  { _id: true }
);

const educationSchema = new mongoose.Schema(
  {
    school: String,
    degree: String,
    from: String,
    to: String,
  },
  { _id: true }
);

const portfolioSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    image: String,
    link: String,
  },
  { _id: true }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["client", "freelancer", "admin"],
      default: "client",
    },
    profileImage: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    hourlyRate: {
      type: Number,
      default: 0,
    },
    skills: {
      type: [String],
      default: [],
    },
    portfolio: [portfolioSchema],
    experience: [experienceSchema],
    education: [educationSchema],
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
