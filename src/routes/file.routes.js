const express = require("express");
const fileController = require("../controller/file.controller");
const upload = require("../middlewares/upload.middleware");
const authMiddleware = require("../middlewares/auth.middleware");
const fileValidationMiddleware = require("../middlewares/file-validation.middleware");
 
const router = express.Router();
router.post(
  "/upload",
  authMiddleware,
  
  upload.single("image"),
fileValidationMiddleware,
  fileController.uploadFile,
);
router.post(
  "/upload-multiple",
  authMiddleware,
  upload.array("files", 5),
  fileController.uploadMultipleFiles,
);
router.get("/", authMiddleware, fileController.getMyfiles);
router.get("/:id", authMiddleware, fileController.getFileById);
router.delete("/:id", authMiddleware, fileController.deleteFileByid);
router.patch("/:id", authMiddleware, fileController.renameFile);
router.get("/download/:id", authMiddleware, fileController.downlaodFile);

module.exports = router;
