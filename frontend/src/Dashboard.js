import React, { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {

  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    high: 0,
    resolved: 0,
    failedLogins: 0
  });

  useEffect(() => {
    fetchAlerts();
    fetchFailedLoginStats();
  }, []);

  // ===============================
  // FETCH ALERTS
  // ===============================
  const fetchAlerts = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "https://security-project-eyyg.onrender.com/api/auth/alerts",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAlerts(res.data);

      // CALCULATE STATS
      const total = res.data.length;
      const high = res.data.filter(a => a.severity === "high").length;
      const resolved = res.data.filter(a => a.resolved === true).length;

      setStats(prev => ({
        ...prev,
        total,
        high,
        resolved
      }));

    } catch (error) {
      console.error("Error fetching alerts:", error);
    }
  };

  // ===============================
  // FETCH FAILED LOGIN ANALYTICS
  // ===============================
  const fetchFailedLoginStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "https://security-project-eyyg.onrender.com/api/auth/analytics/failed-logins",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const todayCount = res.data.length > 0 ? res.data[0].count : 0;

      setStats(prev => ({
        ...prev,
        failedLogins: todayCount
      }));

    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  // ===============================
  // DOWNLOAD CSV
  // ===============================
  const handleDownloadCSV = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "https://security-project-eyyg.onrender.com/api/auth/reports/export-alerts",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "alerts-report.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();

    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  // ===============================
  // LOGOUT
  // ===============================
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>

      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px" }}>
        <h1>Security Dashboard</h1>
        <div>
          <button onClick={handleDownloadCSV} style={{ marginRight: "10px" }}>
            Download Report
          </button>
          <button onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* ===============================
          STATS CARDS
      =============================== */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>

        <div style={cardStyle}>
          <h3>Total Alerts</h3>
          <p>{stats.total}</p>
        </div>

        <div style={{ ...cardStyle, backgroundColor: "#ffe6e6" }}>
          <h3>High Severity</h3>
          <p>{stats.high}</p>
        </div>

        <div style={{ ...cardStyle, backgroundColor: "#e6ffe6" }}>
          <h3>Resolved</h3>
          <p>{stats.resolved}</p>
        </div>

        <div style={{ ...cardStyle, backgroundColor: "#fff5cc" }}>
          <h3>Failed Logins (Today)</h3>
          <p>{stats.failedLogins}</p>
        </div>

      </div>

      {/* ALERT LIST */}
      <h2>Alerts</h2>

      {alerts.length === 0 ? (
        <p>No alerts found</p>
      ) : (
        alerts.map(alert => (
          <div key={alert._id} style={alertCardStyle}>
            <p><strong>Reason:</strong> {alert.reason}</p>
            <p><strong>Severity:</strong> {alert.severity}</p>
            <p><strong>Resolved:</strong> {alert.resolved ? "Yes" : "No"}</p>
            <p><strong>Date:</strong> {new Date(alert.createdAt).toLocaleString()}</p>
          </div>
        ))
      )}

    </div>
  );
}

const cardStyle = {
  padding: "20px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  width: "200px",
  textAlign: "center",
  backgroundColor: "#f2f2f2"
};

const alertCardStyle = {
  border: "1px solid red",
  padding: "15px",
  marginBottom: "15px",
  borderRadius: "5px",
  backgroundColor: "#ffe6e6"
};

export default Dashboard;