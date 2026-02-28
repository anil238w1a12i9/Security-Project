const express = require("express");
const router = express.Router();

const { registerUser, loginUser } = require("../controllers/authController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const Log = require("../models/Log");
const Alert = require("../models/Alert");
const User = require("../models/User");

const { Parser } = require("json2csv");


// ==============================
// REGISTER
// ==============================
router.post("/register", registerUser);


// ==============================
// LOGIN
// ==============================
router.post("/login", loginUser);


// ==============================
// PROTECTED PROFILE ROUTE
// ==============================
router.get("/profile", protect, (req, res) => {
    res.json({
        message: "Welcome to protected route",
        user: req.user
    });
});


// ==============================
// VIEW LOGS (ADMIN ONLY)
// ==============================
router.get("/logs", protect, adminOnly, async (req, res) => {
    try {
        const logs = await Log.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});


// ==============================
// VIEW ALERTS (WITH FILTERING)
// ==============================
router.get("/alerts", protect, adminOnly, async (req, res) => {
    try {
        const { severity, resolved } = req.query;

        let filter = {};

        if (severity) {
            filter.severity = severity;
        }

        if (resolved !== undefined) {
            filter.resolved = resolved === "true";
        }

        const alerts = await Alert.find(filter)
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        res.json(alerts);

    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});


// ==============================
// MARK ALERT AS RESOLVED (ADMIN)
// ==============================
router.put("/alerts/:id/resolve", protect, adminOnly, async (req, res) => {
    try {
        const alert = await Alert.findByIdAndUpdate(
            req.params.id,
            { resolved: true },
            { new: true }
        );

        if (!alert) {
            return res.status(404).json({ message: "Alert not found" });
        }

        res.json({
            message: "Alert marked as resolved",
            alert
        });

    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// ==============================
// DASHBOARD STATS (ADMIN ONLY)
// ==============================
router.get("/dashboard-stats", protect, adminOnly, async (req, res) => {
    try {

        const totalUsers = await User.countDocuments();
        const totalLogs = await Log.countDocuments();
        const totalAlerts = await Alert.countDocuments();

        const activeAlerts = await Alert.countDocuments({ resolved: false });
        const highSeverityAlerts = await Alert.countDocuments({ severity: "high" });

        const failedLast24Hours = await Log.countDocuments({
            status: "failed",
            createdAt: { 
                $gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
            }
        });

        res.json({
            totalUsers,
            totalLogs,
            totalAlerts,
            activeAlerts,
            highSeverityAlerts,
            failedLast24Hours
        });

    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});
// ==============================
// FAILED LOGIN ANALYTICS (LAST 7 DAYS)
// ==============================
router.get("/analytics/failed-logins", protect, adminOnly, async (req, res) => {
    try {

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

        const data = await Log.aggregate([
            {
                $match: {
                    status: "failed",
                    createdAt: { $gte: sevenDaysAgo }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json(data);

    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});
// ==============================
// DAILY ALERT SUMMARY
// ==============================
router.get("/reports/daily-summary", protect, adminOnly, async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const totalAlerts = await Alert.countDocuments({
            createdAt: { $gte: today }
        });

        const highSeverity = await Alert.countDocuments({
            createdAt: { $gte: today },
            severity: "high"
        });

        const resolved = await Alert.countDocuments({
            createdAt: { $gte: today },
            resolved: true
        });

        const unresolved = await Alert.countDocuments({
            createdAt: { $gte: today },
            resolved: false
        });

        res.json({
            date: today.toISOString().split("T")[0],
            totalAlerts,
            highSeverity,
            resolved,
            unresolved
        });

    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});
// ==============================
// USER ACTIVITY REPORT
// ==============================
router.get("/reports/user/:userId", protect, adminOnly, async (req, res) => {
    try {
        const logs = await Log.find({ user: req.params.userId })
            .sort({ createdAt: -1 });

        res.json(logs);

    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// ==============================
// EXPORT ALERTS CSV
// ==============================
router.get("/reports/export-alerts", protect, adminOnly, async (req, res) => {
    try {
        const alerts = await Alert.find().lean();

        const fields = ["reason", "severity", "resolved", "createdAt"];
        const parser = new Parser({ fields });
        const csv = parser.parse(alerts);

        res.header("Content-Type", "text/csv");
        res.attachment("alerts-report.csv");
        return res.send(csv);

    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});
module.exports = router;