import Application from "../models/ApplicationModel.js";
import mongoose from "mongoose";

// Create a new application
export const createApplication = async (req, res) => {
    try {
        const { jobId, userId, status } = req.body;

        const existing = await Application.findOne({ jobId, userId });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: "You have already applied for this job."
            });
        }
        const newApplication = await Application.create({ jobId, userId, status: status || "Applied" });
        res.status(201).json({
            success: true,
            message: "Application successfully created!",
            data: newApplication,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to create application",
            error: error.message,
        });
    }
};

// Get all applications for a specific user
export const getUserApplications = async (req, res) => {
    const { userId } = req.params;

    try {
        const applications = await Application.find({ userId }).populate("jobId", "title company").populate("userId", "name email");

        if (!applications.length) {
            return res.status(404).json({
                success: false,
                message: "No applications found for this user.",
            });
        }

        res.status(200).json({
            success: true,
            data: applications,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch user applications",
            error: error.message,
        });
    }
};

// Get all application for recruiter posted job.
export const getRecruiterApplications = async (req, res) => {
    const { recruiterId } = req.params;

    try {
        const applications = await Application.find()
            .populate({
                path: "jobId",
                match: { recruiterId: recruiterId },
                select: "title company recruiterId"
            })
            .populate("userId", "name email");

        const filtered = applications.filter(app => app.jobId !== null);

        res.status(200).json({
            success: true,
            data: filtered
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch recruiter applications",
            error: error.message,
        });
    }
};

// Get all applications for a specific job
export const getJobApplications = async (req, res) => {
    const { jobId } = req.params;

    try {
        const applications = await Application.find({ jobId }).populate("userId", "name email");

        if (!applications.length) {
            return res.status(404).json({
                success: false,
                message: "No applications found for this job.",
            });
        }

        res.status(200).json({
            success: true,
            data: applications,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch job applications",
            error: error.message,
        });
    }
};

// Update application status
export const updateApplicationStatus = async (req, res) => {
    const { applicationId } = req.params;
    const { status } = req.body;
    if (!["Applied", "Reviewing", "Accepted", "Rejected"].includes(status)) {
        return res.status(400).json({
            success: false,
            message: "Invalid status provided",
        });
    }

    try {
        const updatedApplication = await Application.findByIdAndUpdate(
            applicationId,
            { status },
            { new: true }
        );

        if (!updatedApplication) {
            return res.status(404).json({
                success: false,
                message: "Application not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Application status updated successfully.",
            data: updatedApplication,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to update application status",
            error: error.message,
        });
    }
};

// Delete an application
export const deleteApplication = async (req, res) => {
    const { applicationId } = req.params;

    try {
        const deletedApplication = await Application.findByIdAndDelete(applicationId);

        if (!deletedApplication) {
            return res.status(404).json({
                success: false,
                message: "Application not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Application deleted successfully.",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to delete application",
            error: error.message,
        });
    }
};
