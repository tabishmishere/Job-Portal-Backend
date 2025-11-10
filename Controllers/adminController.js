import User from "../models/userModel.js";
import Job from "../models/Job.js";
import path from "path";
import fs from "fs";
import Application from "../models/Application.js";


export const adminGetAllUsers = async (req, res) => {
  try {
   const users = await User.find({ role: { $ne: "admin" } })
  .select("-password")
  .sort({ createdAt: -1 });
    res.status(200).json({ success: true, users });
  } catch (err) {
    console.error("adminGetAllUsers error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const adminUpdateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, isVerified } = req.body;

    const update = {};
    if (role) update.role = role;
    if (typeof isVerified !== "undefined") update.isVerified = isVerified;

    const user = await User.findByIdAndUpdate(id, update, { new: true }).select(
      "-password"
    );
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, message: "User updated", user });
  } catch (err) {
    console.error("adminUpdateUserRole error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const adminDeleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    await user.deleteOne();
    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    console.error("adminDeleteUser error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const adminGetAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("recruiterId", "name email role").sort({ createdAt: -1 });
    res.json({ success: true, jobs });
  } catch (err) {
    console.error("adminGetAllJobs error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const adminDeleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    await job.deleteOne();
    res.json({ success: true, message: "Job deleted by admin" });
  } catch (err) {
    console.error("adminDeleteJob error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAdminProfile = async (req, res) => {
  try {
    const admin = await User.findById(req.user._id).select("-password");
    if (!admin) return res.status(404).json({ success: false, message: "Admin not found" });
    res.status(200).json({ success: true, admin });
  } catch (err) {
    console.error("getAdminProfile error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const updateAdminProfile = async (req, res) => {
  try {
     console.log("req.file:", req.file); // debug
    const admin = await User.findById(req.user._id);
    if (!admin) return res.status(404).json({ success: false, message: "Admin not found" });


    if (req.body.name) admin.name = req.body.name;


    if (req.file) {
         if (admin.profile.avatar) {
        const oldPath = path.join(process.cwd(), admin.profile.avatar);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      const avatarUrl = `/uploads/${req.file.filename}`;
      admin.profile.avatar = avatarUrl;
    }

    await admin.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      admin,
    });
  } catch (err) {
    console.error("updateAdminProfile error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: { $ne: "admin" } });
    const totalRecruiters = await User.countDocuments({ role: "recruiter" });
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();
    res.json({ totalUsers, totalRecruiters, totalJobs, totalApplications });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


export const adminGetRecentJobs = async (req, res) => {
  const limit = parseInt(req.query.limit) || 3;
  const jobs = await Job.find().populate("recruiterId", "name email role").sort({ createdAt: -1 }).limit(limit);
  res.json({ jobs });
};


export const adminGetRecentUsers = async (req, res) => {
  const limit = parseInt(req.query.limit) || 3;
  const users = await User.find({ role: { $ne: "admin" } })
    .select("-password")
    .sort({ createdAt: -1 })
    .limit(limit);
  res.json({ users });
};