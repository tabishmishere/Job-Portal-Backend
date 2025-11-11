import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: String,
    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Remote", "Intern", "Contract"],
      default: "Full-time",
    },
    salaryRange: String,
    category: String,
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    company: {
      name: { type: String, default: "" },
      logo: { type: String, default: "" },
      website: { type: String, default: "" },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
