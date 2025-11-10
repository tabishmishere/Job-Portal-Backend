// backend/controllers/recruiterController.js
import User from "../models/userModel.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";


export const updateRecruiterProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const userId = req.user._id;

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (req.file) {
      updateData["profile.avatar"] = `/uploads/avatars/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("updateRecruiterProfile error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getRecruiterDashboard = async (req, res) => {
  try {
    const recruiterId = req.user._id;


    const jobs = await Job.find({ recruiterId }).sort({ createdAt: -1 });

    const totalJobs = jobs.length;
    const activeJobs = jobs.filter((j) => j.isActive).length;
    const inactiveJobs = jobs.filter((j) => !j.isActive).length;

    // Get total applications for these jobs
    const jobIds = jobs.map((j) => j._id);
    const totalApplications = jobIds.length
      ? await Application.countDocuments({ jobId: { $in: jobIds } })
      : 0;

    
    const shortlisted = Math.floor(totalApplications * 0.2);
    const savedCandidates = Math.floor(totalApplications * 0.1);

  
    const postedJobs = jobs.map((j) => ({
      _id: j._id,
      title: j.title,
      location: j.location,
      jobType: j.jobType,
      createdAt: j.createdAt,
      isActive: j.isActive,
    }));

    res.status(200).json({
      success: true,
      stats: {
        totalJobs,
        activeJobs,
        inactiveJobs,
        totalApplications,
        shortlisted,
        savedCandidates,
      },
      postedJobs,
    });
  } catch (error) {
    console.error("getRecruiterDashboard error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
