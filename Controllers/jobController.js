import Job from "../models/Job.js";

export const createJob = async (req, res) => {
  try {
    // Check if user is available from protect middleware
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { title, description, location, jobType, salaryRange, category, company } = req.body;

    // Ensure company object is always valid
    const companyData = company || { name: "", logo: "", website: "" };

    // Assign recruiterId from the authenticated user
    const newJob = await Job.create({
      title,
      description,
      location,
      jobType,
      salaryRange,
      category,
      recruiterId: req.user._id, // use _id from Mongoose
      company: companyData,
    });

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      job: newJob,
    });
  } catch (error) {
    console.error("Create job error:", error); // logs full error in backend console
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// ✅ Get All Jobs (admin or recruiter)
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("recruiterId", "name email role");
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching jobs", error: error.message });
  }
};

// ✅ Get Single Job
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: "Error fetching job", error: error.message });
  }
};

// ✅ Update Job
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.recruiterId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to edit this job" });
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating job", error: error.message });
  }
};

// ✅ Delete Job
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.recruiterId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this job" });
    }

    await job.deleteOne();
    res.status(200).json({ success: true, message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting job", error: error.message });
  }
};
