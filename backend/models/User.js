const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  name: {
    type: String
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String
  },

  role: {
    type: String,
    default: "user"
  },

  provider: {
    type: String,
    default: "email"
  },

  googleId: {
    type: String
  },

  microsoftId: {
    type: String
  },

  loginAttempts: {
    type: Number,
    default: 0
  },

  lockUntil: {
    type: Date
  }

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);