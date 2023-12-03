require("dotenv").config();
const express = require("express");
const router = express.Router();

const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

const User = require("../models/user");

// user register
router.post("/register", async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword,
      emailToken: crypto.randomBytes(64).toString("hex"),
    });

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "User registered successfully. Check your email for verification.",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

// user login
router.post("/login", async (req, res) => {
  try {
    const findUser = await User.findOne({ email: req.body.email });

    if (findUser) {
      const validPassword = await bcrypt.compare(
        req.body.password,
        findUser.password
      );

      if (validPassword) {
        return res.status(200).json({ success: true });
      } else {
        return res
          .status(400)
          .json({ success: false, message: "Invalid Password" });
      }
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Email Not Found" });
    }
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Login Fail" });
  }
});

module.exports = router;
