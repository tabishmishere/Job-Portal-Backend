import mongoose from "mongoose";
const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: String,
  jobType: {
    type: String,
    enum: ["Full-time", "Part-time", "Remote", "Intern"],
  },
  salaryRange: String,
  category: String,
  // It has relationship with user userId.
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  company: {
    name: String,
    logo: String,
    website: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

export default mongoose.model("Job", jobSchema);
