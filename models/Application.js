import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  applicantId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  education: String,
  experience: String,
  skills: [String],
  cv: String,
  message: String,
}, { timestamps: true });

export default mongoose.models.Application || mongoose.model("Application", applicationSchema);
