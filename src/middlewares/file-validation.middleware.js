
const fs = require("fs/promises");

async function fileValidationMiddleware(req, res, next) {
  try {
    const files = req.files || (req.file ? [req.file] : []);

    if (files.length === 0) {
      return next();
    }

    const { fileTypeFromFile } = await import("file-type");
    const allowedTypes = ["image/jpeg", "image/png"];

    for (const file of files) {
      const detectedType = await fileTypeFromFile(file.path);

      if (!detectedType || !allowedTypes.includes(detectedType.mime)) {
        await Promise.all(
          files.map((item) => fs.unlink(item.path).catch(() => {}))
        );

        return res.status(400).json({
          message: "Only genuine JPEG and PNG files are allowed",
        });
      }

      if (detectedType.mime !== file.mimetype) {
        await Promise.all(
          files.map((item) => fs.unlink(item.path).catch(() => {}))
        );

        return res.status(400).json({
          message: "File content does not match its declared type",
        });
      }
    }

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = fileValidationMiddleware;
