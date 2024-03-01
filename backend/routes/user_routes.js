require("dotenv").config();
const express = require("express");
const router = express.Router();

const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const cookie = require("cookie-parser");

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

    sendVerificationEmail(
      user._id,
      user.firstName,
      user.email,
      user.emailToken
    );

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

// create token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// user login
router.post("/login", async (req, res) => {
  try {
    const findUser = await User.findOne({ email: req.body.email });

    //check password
    if (findUser) {
      //check user verified
      if (!findUser.verified) {
        return res.json({
          success: false,
          message: "Please Check Your Email to Verify Your Account",
        });
      }

      //check password
      const validPassword = await bcrypt.compare(
        req.body.password,
        findUser.password
      );

      if (validPassword) {
        //create token
        const token = createToken(findUser._id);
        //store token in cookie
        res.cookie(String(findUser._id), token, {
          path: "/",
          expires: new Date(Date.now() + 1000 * 40),
          httpOnly: true,
          sameSite: "lax",
        });
        console.log("Generated Token\n", token);

        return res.status(200).json({ success: true, user: findUser, token });
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

// verify email
router.get("/:id/verify/:token", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });

    if (user) {
      await User.updateOne({ _id: user._id, verified: true, emailToken: null });
      res.json({ success: true, message: "Account Verified Successfully..." });
    } else {
      res.json({ success: false, message: "404 User Not Found !" });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Internal Server Error !" });
  }
});

// verify token when laoding dashboard
router.get("/verifyToken", async (req, res) => {
  try {
    const token = req.cookies["access-token"];

    if (token) {
      const validateToken = await jwt.verify(token, process.env.JWT_SECRET);
      if (validateToken) {
        res.json({ verifyToken: true, message: "Token Verified" });
        //redirect to dashboard
      } else {
        res.json({ verifyToken: false, message: "Invalid Token or Expired" });
        // redirect to login
      }
    } else {
      res.json({ verifyToken: false, message: "Token Not Found" });
      // redirect to login
    }
  } catch (error) {
    console.error(error);
    res.json({ verifyToken: false, message: "Token Expired" });
  }
});

router.get("/auth_user", async (req, res, next) => {
  const cookies = req.headers.cookie;
  const token = cookies.split("=")[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user) {
        res.status(404).json({ authUser: false, message: "User Not Found" });
      } else {
        res.status(200).json({
          authUser: true,
          user: user,
          message: "Token and User Verified",
        });
      }
    } catch (err) {
      res.json({ authUser: false, message: "Token Invalid or Expired" });
    }
  } else {
    res.status(404).json({ authUser: false, message: "Token Not Found" });
  }
});

router.get("/refresh", async (req, res) => {
  const cookies = req.headers.cookie;
  const preToken = cookies.split("=")[1];

  if (!preToken) {
    return res
      .status(404)
      .json({ refresh: false, message: "Token Not Found" });
  }

  jwt.verify(preToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      res.status(403).json({ refresh: false, message: "Authentication Failed" });
    } else {
      res.clearCookie(String(decoded.id));
      req.cookies[String(decoded.id)] = "";

      const newToken = createToken(decoded.id);
      res.cookie(String(decoded.id), newToken, {
        path: "/",
        expires: new Date(Date.now() + 1000 * 40),
        httpOnly: true,
        sameSite: "lax",
      });
      console.log("Refreshed Token\n", newToken);
      return res.status(200).json({ refresh: true, message: "Token Refreshed" });
    }
  });
});  

//-------------------------------------
// Email sending function (nodemailer)
//-------------------------------------
function sendVerificationEmail(userId, userfirstName, email, emailToken) {
  const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    service: process.env.SERVICE,
    port: Number(process.env.EMAIL_PORT),
    secure: Boolean(process.env.SECURE),
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
  });

  const verificationLink = `${process.env.FRONT_END_URL}/${userId}/verify/${emailToken}`;

  // Send verification email
  transporter
    .sendMail({
      from: process.env.USER,
      to: email,
      subject: "Email Verification",
      html: `<h2>Dear ${userfirstName},</h2>
             <h3>Thanks for registering on our site.</h3>
             <h3>Click <a href="${verificationLink}">here</a> to verify your email.</h3>`,
    })
    .then(() => {
      console.log("Email sent successfully");
    })
    .catch((err) => {
      console.error(err);
    });
}

module.exports = router;
