const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    },
    reason: {
        type: String,
        required: true
    },
    severity: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium"
    },
    resolved: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model("Alert", alertSchema);