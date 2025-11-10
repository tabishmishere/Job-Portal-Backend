import Application from "../models/Application.js";
import Job from "../models/Job.js";
import User from "../models/userModel.js";

// Apply to job
export const applyToJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const applicantId = req.user._id;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    const existing = await Application.findOne({ jobId, applicantId });
    if (existing) return res.status(400).json({ success: false, message: "Already applied" });

    const { education, experience, skills, message } = req.body;

   const cvFile = req.file ? `/uploads/${req.file.filename}` : null;
if (!cvFile) return res.status(400).json({ success: false, message: "CV is required" });

    // Update User profile
    await User.findByIdAndUpdate(applicantId, {
      education,
      experience,
      skills: skills ? skills.split(",").map(s => s.trim()) : [],
      cvUrl: `/uploads/cv/${req.file.filename}`,
    });

    const application = await Application.create({
      jobId,
      applicantId,
      education,
      experience,
      skills: skills ? skills.split(",") : [],
      cv: `/uploads/cv/${req.file.filename}`,
      message,
    });

    res.status(201).json({ success: true, message: "Application submitted successfully", application });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error applying", error: err.message });
  }
};

// Get recruiter applications
export const getRecruiterApplications = async (req, res) => {
  try {
    const recruiterId = req.user._id;

    const applications = await Application.find()
      .populate({
        path: "jobId",
        match: { recruiterId },
        select: "title location jobType recruiterId",
      })
      .populate("applicantId", "name email education experience skills cvUrl");

    const filtered = applications.filter(app => app.jobId && app.applicantId
 !== null);

    res.status(200).json({ success: true, applications: filtered });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update application status
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "accepted", "rejected"].includes(status))
      return res.status(400).json({ success: false, message: "Invalid status" });

    const application = await Application.findById(id).populate("jobId");
    if (!application) return res.status(404).json({ success: false, message: "Application not found" });

    if (application.jobId.recruiterId.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: "Not authorized" });

    application.status = status;
    await application.save();

    res.json({ success: true, message: `Application ${status} successfully`, application });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getRecruiterJobs = async (req, res) => {
  try {
    const recruiterId = req.user._id;

    const jobs = await Job.find({ recruiterId }).lean();

    const jobsWithApplicants = await Promise.all(
      jobs.map(async (job) => {
        const applicantCount = await Application.countDocuments({ jobId: job._id });
        return { ...job, applicantCount };  
      })
    );

    res.json({ success: true, jobs: jobsWithApplicants });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching jobs" });
  }
};

export const getUserApplications = async (req, res) => {
  try {
    const { id } = req.params;

    const applications = await Application.find({ applicantId: id })
      .populate({
        path: "jobId",
        select: "title companyName location jobType salary",
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, applications });
  } catch (error) {
    console.error("Error fetching user applications:", error);
    res.status(500).json({ success: false, message: "Failed to fetch applications" });
  }
};
