const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");

const app = express();

/* ===============================
   SECURITY MIDDLEWARE
=============================== */

// Security headers
app.use(helmet());

// Rate limiting (anti brute-force)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests from this IP, please try again later."
});
app.use(limiter);

// CORS (allow frontend domain + localhost)
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://security-project-sable.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

/* ===============================
   ROUTES
=============================== */

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Security Backend Running Successfully");
});

/* ===============================
   DATABASE CONNECTION
=============================== */

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("MongoDB Connected");
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch(err => {
  console.error("Database connection error:", err);
});