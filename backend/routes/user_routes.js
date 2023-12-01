const express = require("express");
const router = express.Router();

const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const User = require("../models/user");

router.post("/register", async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({success: false, message: "Email Already Registered!"});
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      emailToken: crypto.randomBytes(64).toString("hex"),
      isVerified: false,
    });
    await user.save();
    res.status(200).json({success: true, message: "User Registered Successfully"});



  } catch (error) {
    console.log(error);
    res.status(500).json({success: false, message: "Internel Server Error"});
  }
});
