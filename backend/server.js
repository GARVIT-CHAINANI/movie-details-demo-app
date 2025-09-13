// backend/server.js
import express from "express";
import bodyParser from "body-parser";
import fs from "fs";

const app = express();
app.use(bodyParser.json());

// Generate random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ===== SIGNUP =====
app.post("/signup", (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email required" });

  // Check if already exists
  const existing = users.find((u) => u.email === email);
  if (existing)
    return res.status(400).json({ message: "Email already registered" });

  // Generate OTP
  const otp = generateOTP();

  // Store OTP temporarily in memory (not in data.js)
  tempOtps[email] = otp;

  // In real app: send OTP via email, here just return in response
  res.json({ message: "OTP sent (mock)", otp });
});

// ===== VERIFY OTP & SET ID + PASSWORD =====
app.post("/verify-otp", (req, res) => {
  const { email, otp, userId, password } = req.body;

  if (tempOtps[email] !== otp)
    return res.status(400).json({ message: "Invalid OTP" });

  // Save new user
  const newUser = { email, userId, password };
  users.push(newUser);

  // Write to data.js file
  fs.writeFileSync(
    "./data.js",
    `export const users = ${JSON.stringify(users, null, 2)};\n`
  );

  // Remove OTP from temp
  delete tempOtps[email];

  res.json({ message: "Signup successful", userId });
});

// ===== LOGIN =====
app.post("/login", (req, res) => {
  const { userId, password } = req.body;

  const user = users.find(
    (u) => u.userId === userId && u.password === password
  );
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  res.json({ message: "Login successful", email: user.email });
});

// Temporary OTP storage
const tempOtps = {};

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
