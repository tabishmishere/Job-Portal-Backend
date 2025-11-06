// Controllers/jobController.js
import Job from "../models/Job.js";

export const createJob = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }
    const { title, description, location, jobType, salaryRange, category, company } = req.body;
    const companyData = company || { name: "", logo: "", website: "" };

    const newJob = await Job.create({
      title,
      description,
      location,
      jobType,
      salaryRange,
      category,
      recruiterId: req.user._id,
      company: companyData,
    });

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      job: newJob,
    });
  } catch (error) {
    console.error("Create job error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get All Jobs (public). Return consistent object shape.
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("recruiterId", "name email role");
    res.status(200).json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({ message: "Error fetching jobs", error: error.message });
  }
};

// Get jobs posted by authenticated recruiter
export const getJobsByRecruiter = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Not authorized" });

    const recruiterId = req.user._id;
    const jobs = await Job.find({ recruiterId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, jobs });
  } catch (error) {
    console.error("Error fetching recruiter jobs:", error);
    res.status(500).json({ message: "Error fetching jobs", error: error.message });
  }
};

// Get Single Job
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.status(200).json({ success: true, job });
  } catch (error) {
    res.status(500).json({ message: "Error fetching job", error: error.message });
  }
};

// Update Job
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // Ensure only the recruiter who created it can update
    if (job.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this job" });
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, message: "Job updated successfully", job: updatedJob });
  } catch (error) {
    res.status(500).json({ message: "Error updating job", error: error.message });
  }
};

// Delete Job
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this job" });
    }

    await job.deleteOne();
    res.status(200).json({ success: true, message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting job", error: error.message });
  }
};
