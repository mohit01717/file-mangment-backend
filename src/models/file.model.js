const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
    originalFilename: {
      type: String,
      required: true,
    },
    storedFilename: {
      type: String,
      required: true,
    },

    fileType: {
      type: String,
      required: true,
      enum: ["image/jpeg", "image/png"],
    },

    filePath: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const fileModel = mongoose.model("file", fileSchema);
module.exports = fileModel;
