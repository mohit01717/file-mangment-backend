const { default: mongoose } = require("mongoose");
const fileModel = require("../models/file.model");
const fs = require("fs").promises;
async function uploadFile(req, res) {
  try {
    await fileModel.create({
      ownerId: req.user.userId,
      originalFilename: req.file.filename,
      storedFilename: req.file.originalname,
      fileType: req.file.mimetype,
      filePath: req.file.path,
    });
    res.status(201).json({
      messsage: "upload file successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "error in uploading file",
    });
  }
}
 async function uploadMultipleFiles(req, res) {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: "Please upload at least one file",
      });
    }
    for (const file of req.files) {
      await fileModel.create({
        ownerId: req.user.userId,
        originalFilename: file.filename,
        storedFilename: file.originalname,
        fileType: file.mimetype,
        filePath: file.path,
      });
    }
    return res.status(201).json({
      message: "Files uploaded successfully",
    });
  } catch (error) {
    console.log("Multiple upload error", error);
    res.status(500).json({
      message: "server error",
    });
  }
}

async function getMyfiles(req, res) {
  try {
    const files = await fileModel.find({ ownerId: req.user.userId });

    res.status(200).json({
      message: "fetched users files successfully",
      files,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
    });
  }
}


async function getFileById(req, res) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid file ID",
      });
    }

    const { id } = req.params;

    const file = await fileModel.findOne({
      _id: id,
      ownerId: req.user.userId,
    });

    if (!file) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    return res.status(200).json({
      message: "File fetched successfully",
      file,
    });
  } catch (err) {
    console.error("GET FILE ERROR:", err.message);

    return res.status(500).json({
      message: "Server error",
    });
  }
}


async function deleteFileByid(req, res) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
  return res.status(400).json({
    message: "Invalid file ID",
  });
}
    const { id } = req.params;
    const { userId } = req.user;

    const file = await fileModel.findOne({
      _id: id,
      ownerId: userId,
    });

    if (!file) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    await fs.unlink(file.filePath);

    await fileModel.deleteOne({
      _id: file._id,
      ownerId: userId,
    });

    return res.status(200).json({
      message: "File deleted successfully",
    });
  } catch (error) {
    console.error("DELETE ERROR:", error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

async function renameFile(req, res) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
  return res.status(400).json({
    message: "Invalid file ID",
  });
}
    const { id } = req.params;
    const { userId } = req.user;
    const { filename } = req.body;

    if (!filename || filename.trim().length === 0) {
      return res.status(400).json({
        message: "filename is invalid",
      });
    }
    const file = await fileModel.findOne({
      _id: id,
      ownerId: userId,
    });

    if (!file) {
      return res.status(404).json({
        message: "file not found",
      });
    }
    const updatedFile = await fileModel
      .findOneAndUpdate(
        { _id: id, ownerId: userId },
        { originalFilename: filename },
        { returnDocument: "after" },
      )
      .select("-ownerId -_id");
    res.status(200).json({
      message: "file updated successfully",
      updatedFile,
    });
  } catch (err) {
    res.status(500).json({
      message: "server error",
    });
  }
}

async function downlaodFile(req, res) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
  return res.status(400).json({
    message: "Invalid file ID",
  });
}
    const { id } = req.params;
    const { userId } = req.user;
    const file = await fileModel.findOne({
      _id: id,
      ownerId: userId,
    });
    if (!file) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    return res.download(file.filePath, file.originalFilename);
  } catch (error) {
    res.status(500).json({
      message: "server error",
    });
  }
}

module.exports = {
  uploadFile,
  getMyfiles,
  getFileById,
  deleteFileByid,
  renameFile,
  downlaodFile,
  uploadMultipleFiles,
};
