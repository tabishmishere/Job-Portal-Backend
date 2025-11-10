import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
{

name: { type: String, required: true },
email: { type: String, required: true, unique: true },
password: { type: String, required: true },
role: { type: String, enum: ["user", "recruiter", "admin"], default: "user" },
isVerified: { type: Boolean, default: false },
education: String,
experience: String,
skills: [String],
cvUrl: String,
profile: {
avatar: { type: String, default: "" },
},
},
{ timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);