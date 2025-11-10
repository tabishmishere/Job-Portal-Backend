import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export const getAllUsers = async (req, res) => {
try {
const users = await User.find();
res.status(200).json({
success: true,
data: users,
count: users.length,
});
} catch (error) {
console.error("Error fetching users:", error);
res.status(500).json({ success: false, message: "Server Error" });
}
};


export const createAllUsers = async (req, res) => {
try {
const { name, email, password, role } = req.body;


if (!name || !email || !password) {
return res.status(400).json({ message: "All fields are required" });
}


const existingUser = await User.findOne({ email });
if (existingUser) {
return res.status(400).json({ message: "Email already exists" });
}


const hashedPassword = await bcrypt.hash(password, 10);

const newUser = new User({
name,
email,
password: hashedPassword,
role: role || "user",
isVerified: false,
});

await newUser.save();


const verifyToken = jwt.sign(
{ id: newUser._id, email: newUser.email },
process.env.JWT_SECRET,
{ expiresIn: "1h" }
);


const verifyLink = `http://localhost:5000/api/users/verify/${verifyToken}`;


const transporter = nodemailer.createTransport({
service: "gmail",
auth: {
user: process.env.EMAIL_USER,
pass: process.env.EMAIL_PASS,
},
});

const mailOptions = {
from: `"Job Portal" <${process.env.EMAIL_USER}>`,
to: email,
subject: "Verify Your Email - Job Portal",
html: `
<h2>Hello ${name},</h2>
<p>Thank you for signing up on Job Portal!</p>
<p>Please verify your email by clicking the link below:</p>
<a href="${verifyLink}" target="_blank">Verify Email</a>
<p>This link will expire in 1 hour.</p>
`,
};

await transporter.sendMail(mailOptions);

res.status(201).json({
message: "User created successfully! Please verify your email.",
user: newUser,
});

} catch (error) {
console.error("Signup Error:", error);
res.status(500).json({ message: "Server Error" });
}
};


// Login user
export const loginUser = async (req, res) => {
try {
const { email, password } = req.body;

if (!email || !password) {
return res.status(400).json({ message: "All fields are required" });
}

const user = await User.findOne({ email });
if (!user) {
return res.status(400).json({ message: "Invalid email or password" });
}
if (!user.isVerified) {
return res
.status(403)
.json({ message: "Please verify your email before login." });
}


const isMatch = await bcrypt.compare(password, user.password);
if (!isMatch) {
return res.status(400).json({ message: "Invalid email or password" });
}

const token = jwt.sign(
{ id: user._id, role: user.role },
process.env.JWT_SECRET || "mysecretkey",
{ expiresIn: "1d" }
);

res.status(200).json({
message: "Login successful",
token,
user: {
id: user._id,
name: user.name,
email: user.email,
role: user.role,
profile: user.profile,
},
});
} catch (error) {
console.error(error);
res.status(500).json({ message: "Server error" });
}
};

export const updateUser = async (req, res) => {
try {
const { id } = req.params;
const { name, email, bio, skills } = req.body;

const avatar = req.file ? `/api/uploads/${req.file.filename}` : undefined;

const updatedUser = await User.findByIdAndUpdate(
id,
{
name,
email,
$set: {
"profile.bio": bio,
"profile.skills": skills ? skills.split(",").map((s) => s.trim()) : [],
...(avatar && { "profile.avatar": avatar }),
},
},
{ new: true }
);

if (!updatedUser) {
return res.status(404).json({ message: "User not found" });
}

res.status(200).json({
message: "Profile updated successfully!",
user: updatedUser,
});
} catch (err) {
console.error("UpdateUser Error:", err);
res.status(500).json({ message: err.message || "Server error" });
}
};

export const verifyEmail = async (req, res) => {
try {
const { token } = req.params;
const decoded = jwt.verify(token, process.env.JWT_SECRET);

const user = await User.findById(decoded.id);
if (!user) return res.status(400).send("<h2>Invalid verification link.</h2>");

if (user.isVerified) {
return res.send("<h2>Email is already verified!</h2><p>You can log in now.</p>");
}

user.isVerified = true;
await user.save();


res.send(`
<html>
<head><title>Email Verified</title></head>
<body style="font-family:sans-serif;text-align:center;margin-top:50px;">
<h2>Email verified successfully!</h2>
<p>You can now <a href="http://localhost:5173/login">log in</a>.</p>
</body>
</html>
`);
} catch (error) {
console.error("Verify Error:", error);
res.status(400).send("<h2> Invalid or expired token. Please sign up again.</h2>");
}
};

export const resendVerificationLink = async (req, res) => {
try {
const { email } = req.body;

if (!email) {
return res.status(400).json({ message: "Email is required" });
}

const user = await User.findOne({ email });
if (!user) {
return res.status(404).json({ message: "User not found" });
}

if (user.isVerified) {
return res.status(400).json({ message: "Email already verified" });
}

// Generate new token
const token = jwt.sign(
{ id: user._id, email: user.email },
process.env.JWT_SECRET,
{ expiresIn: "1h" }
);

const verificationLink = `http://localhost:5000/api/users/verify/${token}`;


const transporter = nodemailer.createTransport({
service: "gmail",
auth: {
user: process.env.EMAIL_USER,
pass: process.env.EMAIL_PASS,
},
});

const mailOptions = {
from: `"Job Portal" <${process.env.EMAIL_USER}>`,
to: user.email,
subject: "Email Verification - Job Portal",
html: `
<p>Hello ${user.name},</p>
<p>You requested a new verification link. Please verify your email by clicking below:</p>
<a href="${verificationLink}" target="_blank">Verify Email</a>
<p>This link will expire in 1 hour.</p>
`,
};

await transporter.sendMail(mailOptions);

res.json({ message: "New verification link sent successfully!" });
} catch (error) {
console.error("Resend verification error:", error);
res.status(500).json({ message: "Server error while resending verification link" });
}
};