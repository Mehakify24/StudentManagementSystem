const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");
const upload = require("../middleware/upload");

const router = express.Router();

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// POST /api/auth/register
router.post("/register", upload.single("profilePicture"), async (req, res) => {
  try {
    const { name, email, dob, address, collegeId, contact, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const query = [{ email }];
    if (collegeId) query.push({ collegeId });
    
    const exists = await User.findOne({ $or: query });
    if (exists) {
      return res.status(409).json({ message: "Email or College ID already registered" });
    }

    let profilePicturePath = "";
    if (req.file) {
      profilePicturePath = "/uploads/" + req.file.filename;
    }

    const user = await User.create({ 
      name, 
      email, 
      dob, 
      address, 
      collegeId, 
      contact, 
      password,
      profilePicture: profilePicturePath
    });

    const token = signToken(user._id);
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ message: "Identifier and password required" });
    }
    const user = await User.findOne({
      $or: [{ email: identifier.toLowerCase() }, { collegeId: identifier }],
    });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(user._id);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/auth/me
router.get("/me", auth, (req, res) => {
  res.json({ user: req.user });
});

// GET /api/auth/users (Admin only)
router.get("/users", auth, adminAuth, async (req, res) => {
  try {
    const users = await User.find({ role: "student" }).select("-password");
    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
