const express = require("express");
const authController = require("../controller/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");
const userModel = require("../models/user.model");

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/profile", authMiddleware, authController.getProfile);
router.get("/user/admin", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).json({
      message: "fetched admin users ",
      users,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

module.exports = router;
