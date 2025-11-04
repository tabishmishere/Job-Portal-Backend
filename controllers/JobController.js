import Job from "../models/JobModel.js";
import mongoose from "mongoose";

// Get All Jobs Controller
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("recruiterId", "name email")
    return res.status(200).json({
      message: "Jobs fetched successfully.",
      jobs,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Create Job Controller
export const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      jobType,
      salaryRange,
      category,
      recruiterId,
      company,
      isActive,
    } = req.body;

    const newJob = new Job({
      title,
      description,
      location,
      jobType,
      salaryRange,
      category,
      recruiterId,
      company,
      isActive,
    });

    await newJob.save();
    return res.status(201).json({
      message: "Job created successfully.",
      job: newJob,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Update Job Controller
export const updateJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const updates = req.body;

    const updatedJob = await Job.findByIdAndUpdate(jobId, updates, {
      new: true,
    });

    if (!updatedJob) {
      return res.status(404).json({
        message: "Job not found.",
      });
    }

    return res.status(200).json({
      message: "Job updated successfully.",
      job: updatedJob,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Delete Job Controller
export const deleteJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const deletedJob = await Job.findByIdAndDelete(jobId);

    if (!deletedJob) {
      return res.status(404).json({
        message: "Job not found.",
      });
    }

    return res.status(200).json({
      message: "Job deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
