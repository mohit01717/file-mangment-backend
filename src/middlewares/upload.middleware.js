const multer = require("multer");

const upload = multer({
  dest: "uploads/",
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG and PNG files are allowed"));
    }
  },
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

module.exports = upload;
