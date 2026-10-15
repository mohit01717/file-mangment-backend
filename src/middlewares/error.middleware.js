const multer = require("multer");

function errorMiddleware(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        message: "File size must not exceed 2 MB",
      });
    }

    return res.status(400).json({
      message: err.message,
    });
  }

  if (err.message === "Only JPEG and PNG files are allowed") {
    return res.status(400).json({
      message: err.message,
    });
  }

  console.error("ERROR:", err.message);

  return res.status(500).json({
    message: "Something went wrong",
  });
}

module.exports = errorMiddleware;
