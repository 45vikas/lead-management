const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const auth = require("../middleware/auth");

// STORAGE CONFIG
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/images/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ✅ UPLOAD IMAGE
router.post("/", auth, upload.single("image"), (req, res) => {
  res.json({
    message: "Image uploaded ✅",
    file: req.file.filename,
  });
});

module.exports = router;