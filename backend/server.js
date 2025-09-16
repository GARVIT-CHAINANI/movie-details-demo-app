import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fs from "fs";

const app = express();
const PORT = 5000;
const USERS_FILE = "users.json";

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Helper: Load users from file
function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([]));
  }
  const data = fs.readFileSync(USERS_FILE);
  return JSON.parse(data);
}

// Helper: Save users to file
function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Register endpoint
app.post("/register", (req, res) => {
  const { userId, password } = req.body;

  if (!userId || !password) {
    return res
      .status(400)
      .json({ message: "UserId and password are required." });
  }

  const users = loadUsers();

  // check uniqueness
  if (users.find((u) => u.userId === userId)) {
    return res.status(400).json({ message: "UserId already exists." });
  }

  users.push({ userId, password });
  saveUsers(users);

  return res.status(201).json({ message: "User registered successfully." });
});

// Login endpoint
app.post("/login", (req, res) => {
  const { userId, password } = req.body;

  if (!userId || !password) {
    return res
      .status(400)
      .json({ message: "UserId and password are required." });
  }

  const users = loadUsers();
  const user = users.find((u) => u.userId === userId);

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  if (user.password !== password) {
    return res.status(401).json({ message: "Invalid password." });
  }

  return res.status(200).json({ message: "Login successful." });
});

// Get all users (for testing only, remove in production!)
app.get("/users", (req, res) => {
  const users = loadUsers();
  res.json(users);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
