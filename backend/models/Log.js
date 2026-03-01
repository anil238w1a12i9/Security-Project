const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  action: {
    type: String,
    required: true
  },
  ip_address: {
    type: String
  },
  status: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model("Log", logSchema);