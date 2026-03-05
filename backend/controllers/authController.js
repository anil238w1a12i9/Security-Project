const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


// =========================
// REGISTER (EMAIL)
// =========================
exports.registerUser = async (req, res) => {

  try {

    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      provider: "email"
    });

    res.json({
      message: "User registered successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: "Server error"
    });

  }
};


// =========================
// LOGIN (EMAIL)
// =========================
exports.loginUser = async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.lockUntil && user.lockUntil > Date.now()) {
      return res.status(403).json({ message: "Account locked. Try again later." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {

      user.loginAttempts += 1;

      if (user.loginAttempts >= 3) {
        user.lockUntil = Date.now() + 10 * 60 * 1000;
      }

      await user.save();

      return res.status(401).json({ message: "Invalid credentials" });
    }

    user.loginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });

  } catch (error) {

    res.status(500).json({ message: "Server error" });

  }
};


// =========================
// GOOGLE LOGIN
// =========================
exports.googleLogin = async (req, res) => {

  try {

    const { credential } = req.body;

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    const email = payload.email;

    let user = await User.findOne({ email });

    if (!user) {

      user = await User.create({
        email,
        googleId: payload.sub,
        provider: "google"
      });

    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });

  } catch (error) {

    res.status(500).json({
      message: "Google login failed"
    });

  }

};