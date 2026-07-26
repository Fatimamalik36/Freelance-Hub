const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");
const Job = require("../models/Job");
const Review = require("../models/Review");

const seed = async () => {
  await connectDB();

  console.log("🧹 Clearing existing data...");
  await Promise.all([User.deleteMany(), Job.deleteMany(), Review.deleteMany()]);

  console.log("👤 Creating users...");

  const admin = await User.create({
    name: "Admin User",
    email: "admin@freelancehub.com",
    password: "admin123",
    role: "admin",
  });

  const client1 = await User.create({
    name: "Sarah Johnson",
    email: "sarah@client.com",
    password: "client123",
    role: "client",
    bio: "Marketing director looking for top talent to grow our brand.",
    location: "New York, USA",
  });

  const client2 = await User.create({
    name: "Michael Chen",
    email: "michael@client.com",
    password: "client123",
    role: "client",
    bio: "Startup founder building the next big thing.",
    location: "San Francisco, USA",
  });

  const freelancers = await User.create([
    {
      name: "Emma Williams",
      email: "emma@freelancer.com",
      password: "freelancer123",
      role: "freelancer",
      title: "Senior UI/UX Designer",
      bio: "Award-winning designer with 8+ years crafting delightful digital experiences for startups and Fortune 500 companies.",
      location: "London, UK",
      hourlyRate: 65,
      skills: ["UI Design", "UX Research", "Figma", "Prototyping", "Branding"],
      rating: 4.9,
      numReviews: 3,
      isVerified: true,
    },
    {
      name: "James Rodriguez",
      email: "james@freelancer.com",
      password: "freelancer123",
      role: "freelancer",
      title: "Full Stack Developer",
      bio: "MERN stack specialist who loves turning complex problems into elegant, scalable code.",
      location: "Austin, USA",
      hourlyRate: 75,
      skills: ["React", "Node.js", "MongoDB", "TypeScript", "AWS"],
      rating: 4.8,
      numReviews: 2,
      isVerified: true,
    },
    {
      name: "Priya Sharma",
      email: "priya@freelancer.com",
      password: "freelancer123",
      role: "freelancer",
      title: "Content Strategist & Copywriter",
      bio: "I help brands find their voice and tell stories that convert readers into customers.",
      location: "Mumbai, India",
      hourlyRate: 40,
      skills: ["Copywriting", "SEO", "Content Strategy", "Blogging"],
      rating: 4.7,
      numReviews: 1,
      isVerified: true,
    },
    {
      name: "David Kim",
      email: "david@freelancer.com",
      password: "freelancer123",
      role: "freelancer",
      title: "Mobile App Developer",
      bio: "Flutter & React Native developer with 10+ published apps on App Store and Play Store.",
      location: "Seoul, South Korea",
      hourlyRate: 80,
      skills: ["Flutter", "React Native", "iOS", "Android", "Firebase"],
      rating: 5.0,
      numReviews: 4,
      isVerified: true,
    },
    {
      name: "Olivia Martin",
      email: "olivia@freelancer.com",
      password: "freelancer123",
      role: "freelancer",
      title: "Digital Marketing Specialist",
      bio: "Data-driven marketer specializing in paid social, SEO, and growth strategy for e-commerce brands.",
      location: "Toronto, Canada",
      hourlyRate: 55,
      skills: ["SEO", "Google Ads", "Meta Ads", "Analytics", "Growth Hacking"],
      rating: 4.6,
      numReviews: 2,
      isVerified: false,
    },
    {
      name: "Ahmed Hassan",
      email: "ahmed@freelancer.com",
      password: "freelancer123",
      role: "freelancer",
      title: "Video Editor & Motion Designer",
      bio: "Crafting cinematic edits and eye-catching motion graphics for brands, YouTubers, and agencies.",
      location: "Dubai, UAE",
      hourlyRate: 45,
      skills: ["Premiere Pro", "After Effects", "Motion Graphics", "Color Grading"],
      rating: 4.8,
      numReviews: 3,
      isVerified: true,
    },
  ]);

  console.log("💼 Creating jobs...");

  const jobs = await Job.create([
    {
      title: "Design a Premium Landing Page for SaaS Product",
      description:
        "We are launching a new SaaS analytics tool and need a stunning, conversion-focused landing page design. Must include hero section, feature highlights, pricing, and testimonials sections. Deliverables in Figma with a full design system.",
      category: "Design",
      skillsRequired: ["UI Design", "Figma", "Landing Page", "Branding"],
      budgetType: "fixed",
      budget: 1200,
      duration: "2 weeks",
      experienceLevel: "expert",
      client: client1._id,
      status: "open",
    },
    {
      title: "Build a Full Stack E-commerce Platform",
      description:
        "Looking for an experienced MERN developer to build a full-featured e-commerce platform with cart, checkout, admin dashboard, and payment integration (Stripe).",
      category: "Development",
      skillsRequired: ["React", "Node.js", "MongoDB", "Stripe"],
      budgetType: "fixed",
      budget: 4500,
      duration: "6 weeks",
      experienceLevel: "expert",
      client: client2._id,
      status: "open",
    },
    {
      title: "SEO Blog Content for Fintech Startup (10 Articles)",
      description:
        "Need a skilled content writer to produce 10 SEO-optimized blog articles (1200-1500 words each) covering personal finance, budgeting, and investing topics.",
      category: "Writing",
      skillsRequired: ["Copywriting", "SEO", "Content Strategy"],
      budgetType: "fixed",
      budget: 800,
      duration: "3 weeks",
      experienceLevel: "intermediate",
      client: client1._id,
      status: "open",
    },
    {
      title: "Cross-Platform Mobile App for Fitness Tracking",
      description:
        "We need a Flutter developer to build a cross-platform fitness tracking app with workout plans, progress charts, and social sharing features.",
      category: "Mobile Development",
      skillsRequired: ["Flutter", "Firebase", "Mobile UI"],
      budgetType: "hourly",
      budget: 35,
      duration: "3 months",
      experienceLevel: "expert",
      client: client2._id,
      status: "open",
    },
    {
      title: "Social Media Ad Campaign Management",
      description:
        "Seeking a growth marketer to plan and manage Meta & Google ad campaigns for our DTC skincare brand. Must have proven track record with ROAS reporting.",
      category: "Marketing",
      skillsRequired: ["Meta Ads", "Google Ads", "Analytics"],
      budgetType: "hourly",
      budget: 30,
      duration: "Ongoing",
      experienceLevel: "intermediate",
      client: client1._id,
      status: "open",
    },
    {
      title: "Promo Video Editing for Product Launch",
      description:
        "Need a talented video editor to cut a 90-second promo video from raw footage, with motion graphics, color grading, and sound design.",
      category: "Video & Animation",
      skillsRequired: ["Premiere Pro", "After Effects", "Motion Graphics"],
      budgetType: "fixed",
      budget: 600,
      duration: "1 week",
      experienceLevel: "intermediate",
      client: client2._id,
      status: "completed",
      hiredFreelancer: freelancers[5]._id,
    },
  ]);

  console.log("⭐ Creating reviews...");

  await Review.create([
    {
      reviewer: client2._id,
      freelancer: freelancers[5]._id,
      job: jobs[5]._id,
      rating: 5,
      comment: "Ahmed delivered an outstanding promo video ahead of schedule. Highly recommend!",
    },
    {
      reviewer: client1._id,
      freelancer: freelancers[0]._id,
      rating: 5,
      comment: "Emma's design work is simply exceptional. Great communication throughout.",
    },
    {
      reviewer: client2._id,
      freelancer: freelancers[1]._id,
      rating: 4.5,
      comment: "James is a strong developer, delivered clean and well-documented code.",
    },
  ]);

  console.log("✅ Seed data created successfully!");
  console.log(`
Demo accounts (password shown for each):
  Admin:      admin@freelancehub.com / admin123
  Client:     sarah@client.com / client123
  Client:     michael@client.com / client123
  Freelancer: emma@freelancer.com / freelancer123
  Freelancer: james@freelancer.com / freelancer123
  (...and 4 more freelancer accounts, all password: freelancer123)
  `);

  mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
