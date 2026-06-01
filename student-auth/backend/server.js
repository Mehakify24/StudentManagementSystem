require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");
const User = require("./models/User");

const app = express();
app.use(cors());
app.use(express.json());

// Serve uploads statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (_req, res) => res.json({ ok: true, service: "student-auth-api" }));
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

// Seed admin function
const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: "admin" });
    if (!adminExists) {
      await User.create({
        name: "Admin",
        email: "admin@admin.com",
        password: "adminpassword", // In production, never use this!
        role: "admin",
      });
      console.log("Admin account seeded: admin@admin.com / adminpassword");
    }
  } catch (err) {
    console.error("Failed to seed admin:", err);
  }
};

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    seedAdmin();
    app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("Mongo connection error:", err);
    process.exit(1);
  });
