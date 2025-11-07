import multer from "multer";
import path from "path";
import fs from "fs";

const cvDir = "uploads/cv";
if (!fs.existsSync(cvDir)) fs.mkdirSync(cvDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, cvDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf" || file.mimetype.includes("word")) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF or Word files are allowed"), false);
  }
};

export const upload = multer({ storage, fileFilter });
