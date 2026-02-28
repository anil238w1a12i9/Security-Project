const User = require("../models/User");
const Log = require("../models/Log");
const Alert = require("../models/Alert");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// ==============================
// REGISTER USER
// ==============================
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      message: "User registered successfully",
      user
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};



// ==============================
// LOGIN USER
// ==============================
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 🔐 Check if account is locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
      return res.status(403).json({
        message: "Account locked. Try again later."
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    // ❌ WRONG PASSWORD
    if (!isMatch) {

      user.loginAttempts += 1;

      // Lock account after 5 failed attempts
      if (user.loginAttempts >= 5) {
        user.lockUntil = Date.now() + 15 * 60 * 1000; // 15 minutes

        // Create high severity alert
        await Alert.create({
          user: user._id,
          reason: "Account locked due to multiple failed attempts",
          severity: "high"
        });
      }

      await user.save();

      await Log.create({
        user: user._id,
        action: "Login Attempt",
        ip_address: req.ip,
        status: "failed"
      });

      return res.status(400).json({ message: "Invalid credentials" });
    }

    // ✅ SUCCESSFUL LOGIN

    // Reset attempts
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    await Log.create({
      user: user._id,
      action: "Login Successful",
      ip_address: req.ip,
      status: "success"
    });

    res.status(200).json({
      message: "Login successful",
      token
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};