const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser
} = require("../controllers/authController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const Alert = require("../models/Alert");
const Log = require("../models/Log");

const { Parser } = require("json2csv");

/* ===============================
   AUTH ROUTES
=============================== */

// REGISTER
router.post("/register", registerUser);

// LOGIN
router.post("/login", loginUser);


/* ===============================
   ALERT ROUTES
=============================== */

// GET ALL ALERTS (Protected)
router.get("/alerts", protect, async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// ADMIN MARK ALERT AS RESOLVED
router.put("/alerts/:id/resolve", protect, adminOnly, async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { resolved: true },
      { new: true }
    );

    res.json({
      message: "Alert marked as resolved",
      alert
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});


/* ===============================
   REPORT EXPORT
=============================== */

// EXPORT ALERTS AS CSV
router.get("/reports/export-alerts", protect, async (req, res) => {
  try {
    const alerts = await Alert.find();

    const fields = ["reason", "severity", "resolved", "createdAt"];
    const json2csv = new Parser({ fields });

    const csv = json2csv.parse(alerts);

    res.header("Content-Type", "text/csv");
    res.attachment("alerts-report.csv");
    res.send(csv);

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});


/* ===============================
   ACTIVITY LOG ROUTES (ADMIN)
=============================== */

// ADMIN VIEW ACTIVITY LOGS
router.get("/activity", protect, adminOnly, async (req, res) => {
  try {
    const logs = await Log.find()
      .populate("user", "email name")
      .sort({ createdAt: -1 });

    res.json(logs);

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});


module.exports = router;