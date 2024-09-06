const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const db = require("./database");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
require("dotenv").config();

const whitelist = ["http://localhost:5174"];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionSuccessStatus: 200
};

app.use(cors(corsOptions));

let verificationCodes = {};

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: "gmail", // or any other email service
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS // Your email password
  },
  debug: true
});

//pesho

// Signup Route
app.post("/signup", (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  db.checkEmailExists(email, (err, results) => {
    if (err) return res.status(500).json({ error: "Database query error" });

    if (results.length > 0) {
      // Email already exists
      return res
        .status(400)
        .json({ error: "Акаунт с този имейл вече съществува." });
    }

    // Generate verification code
    const verificationCode = crypto.randomInt(100000, 999999).toString();

    // Store the code temporarily
    verificationCodes[email] = {
      code: verificationCode,
      firstName,
      lastName,
      password, // Store the password temporarily
      expiresAt: Date.now() + 15 * 60 * 1000 // 15 minutes expiry
    };

    // Send verification code via email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Verification Code",
      html: `<p>Your verification code is <strong>${verificationCode}</strong>.</p>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) return res.status(500).json({ error: "Failed to send email" });
      res.json({ message: "Verification code sent to your email!" });
    });
  });
});

// Verification Route
app.post("/verify-email", (req, res) => {
  const { email, verificationCode } = req.body;

  const storedData = verificationCodes[email];
  if (!storedData) {
    return res
      .status(400)
      .json({ error: "Не е намерен код за потвърждение за този имейл." });
  }

  if (Date.now() > storedData.expiresAt) {
    delete verificationCodes[email];
    return res.status(400).json({ error: "Кодът за потвърждение е изтекъл." });
  }

  if (storedData.code !== verificationCode) {
    return res.status(400).json({ error: "Невалиден код за потвърждение." });
  }

  // Proceed with user registration
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(storedData.password, salt);

  db.createUser(
    storedData.firstName,
    storedData.lastName,
    email,
    hashedPassword,
    (err, result) => {
      if (err) return res.status(400).json({ error: err.message });

      // Remove the code after successful registration
      delete verificationCodes[email];
      res.json({ message: "Успешно регистриран профил!" });
    }
  );
});

// Sign in Route
app.post("/signin", (req, res) => {
  const { email, password, rememberMe } = req.body;

  db.findUserByEmail(email, (err, results) => {
    if (err) return res.status(400).json({ error: err.message });
    if (results.length === 0)
      return res
        .status(400)
        .json({ error: "Не съществува потребител с този имейл адрес!" });

    const user = results[0];
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ error: "Въведената парола е грешна или непълна!" });

    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
      expiresIn: rememberMe ? "7d" : "1h"
    });
    res.json({ message: "Sign in successful", token });
  });
});

// Password Reset Request Route
app.post("/password-reset-request", (req, res) => {
  const { email } = req.body;

  db.findUserByEmail(email, (err, results) => {
    if (err) return res.status(400).json({ error: err.message });
    if (results.length === 0)
      return res
        .status(400)
        .json({ error: "Не съществува потребител с този имейл адрес!" });

    const user = results[0];
    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
      expiresIn: "15m"
    });

    // Create a reset link
    const resetLink = `http://localhost:5174/authentication/resetpassword/resetcover/${token}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) return res.status(500).json({ error: "Failed to send email" });
      res.json({ message: "Password reset link sent to your email!" });
    });
  });
});

// Password Reset Route
app.post("/password-reset", (req, res) => {
  const { token, newPassword } = req.body;

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) return res.status(400).json({ error: "Invalid or expired token" });

    const userId = decoded.id;

    // Hash the new password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(newPassword, salt);

    db.updateUserPassword(userId, hashedPassword, (err, result) => {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: "Password reset successfully!" });
    });
  });
});

// Token Validation Route
app.post("/token-validation", (req, res) => {
  const { token } = req.body;

  jwt.verify(token, process.env.SECRET_KEY, (err) => {
    if (err) return res.json({ valid: false });
    res.json({ valid: true });
  });
});

// Get user data route
app.get("/user-data", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(401).json({ error: "Token not provided" });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });

    const userId = decoded.id;

    db.getUserById(userId, (err, results) => {
      if (err) return res.status(500).json({ error: "Database query error" });
      if (results.length === 0)
        return res
          .status(404)
          .json({ error: "Не съществува потребител с този имейл адрес!" });

      const user = results[0];
      res.json(user);
    });
  });
});

// Start server
app.listen(5000, () => {
  console.log("Server started on http://localhost:5000");
});
