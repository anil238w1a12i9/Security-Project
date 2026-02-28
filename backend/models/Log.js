const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    },
    action: {
        type: String,
        required: true
    },
    ip_address: {
        type: String
    },
    status: {
        type: String,
        enum: ["success", "failed"],
        default: "success"
    }
}, { timestamps: true });

module.exports = mongoose.model("Log", logSchema);