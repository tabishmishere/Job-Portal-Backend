import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html) => {
  // Create transporter using your email provider
  const transporter = nodemailer.createTransport({
    service: "gmail", // or "outlook", "yahoo", etc.
    auth: {
      user: process.env.EMAIL_USER, // your email
      pass: process.env.EMAIL_PASS, // your app password (not your real password)
    },
  });

  // Send email
  await transporter.sendMail({
    from: `"Job Portal" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};
