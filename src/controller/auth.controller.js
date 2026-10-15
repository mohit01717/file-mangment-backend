const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fileModel = require("../models/file.model");
async function register(req, res) {
  const { name, email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (user) {
    return res.status(409).json({
      messge: "user already exists",
    });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  await userModel.create({
    name,
    email,
    password: hashedPassword,
  });
  return res.status(201).json({
    message: "user created successfully",
  });
}

async function login(req, res) {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(401).json({
      message: "user not found",
    });
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return res.status(401).json({
      message: "Password is wrong",
    });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
  return res.status(200).json({
    message: "login successfull",
    token,
  });
}

async function getProfile(req, res) {
  const { userId } = req.user;

  const user = await userModel.findById(userId).select("email name ");
  if (!user) {
    return res.status(404).json({
      message: "user details not found",
    });
  }

  res.status(200).json({
    message: "fetched profile",
    user,
  });
}

async function getProfiewithId(req, res) {
  const { id } = req.params.id;
  const user = await fileModel.findOne({ _id: id });
  if (!user) {
    res.status(404).json({
      message: "user not found",
    });
  }
  res.status(200);
}

module.exports = { register, login, getProfile, getProfiewithId };
