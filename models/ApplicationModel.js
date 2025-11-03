import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        enum: ["Applied", "Reviewing", "Accepted", "Rejected"],
        default: "Applied"
    },
}, { timestamps: true });

// Index for quick lookup by jobId and userId
applicationSchema.index({ jobId: 1, userId: 1 });

export default mongoose.model("Application", applicationSchema);
