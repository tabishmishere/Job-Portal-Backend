import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "recruiter", "admin"], default: "user" },

    profile: {
      bio: String,
      skills: [String],
      resume: String,
      avatar: String,
    },

    recruiterProfile: {
      companyName: String,
      companyWebsite: String,
      contactNumber: String,
      designation: String,
      companyDescription: String,
      profileImage: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
