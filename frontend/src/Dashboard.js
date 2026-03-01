import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Paper,
  Chip,
  Switch,
  FormControlLabel
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function Dashboard() {
  const [alerts, setAlerts] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "https://security-project-eyyg.onrender.com/api/auth/alerts",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setAlerts(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const totalAlerts = alerts.length;
  const highSeverity = alerts.filter(a => a.severity === "high").length;
  const resolved = alerts.filter(a => a.resolved).length;
  const unresolved = totalAlerts - resolved;

  const chartData = [
    { name: "High", value: highSeverity },
    { name: "Resolved", value: resolved },
    { name: "Unresolved", value: unresolved }
  ];

  const backgroundColor = darkMode ? "#121212" : "#f5f5f5";
  const textColor = darkMode ? "#ffffff" : "#000000";

  return (
    <div style={{ background: backgroundColor, minHeight: "100vh", padding: "30px" }}>
      <Container maxWidth="lg">

        {/* HEADER */}
        <Grid container justifyContent="space-between" alignItems="center">
          <Typography variant="h4" style={{ color: textColor }}>
            Advanced Security Dashboard
          </Typography>

          <div>
            <FormControlLabel
              control={
                <Switch
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                />
              }
              label="Dark Mode"
              style={{ color: textColor }}
            />

            <Button
              variant="contained"
              color="error"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </Grid>

        {/* STAT CARDS */}
        <Grid container spacing={3} style={{ marginTop: "30px" }}>
          <Grid item xs={12} md={4}>
            <Card style={{ transition: "0.3s", transform: "scale(1.02)" }}>
              <CardContent>
                <Typography variant="h6">Total Alerts</Typography>
                <Typography variant="h4">{totalAlerts}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">High Severity</Typography>
                <Typography variant="h4" color="error">
                  {highSeverity}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Resolved</Typography>
                <Typography variant="h4" color="success.main">
                  {resolved}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* CHART SECTION */}
        <Paper style={{ marginTop: "40px", padding: "20px" }}>
          <Typography variant="h6" gutterBottom>
            Alert Analytics
          </Typography>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#1976d2" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>

        {/* ALERT LIST */}
        <Paper style={{ marginTop: "40px", padding: "20px" }}>
          <Typography variant="h6" gutterBottom>
            Recent Alerts
          </Typography>

          {alerts.map(alert => (
            <Card key={alert._id} style={{ marginBottom: "15px" }}>
              <CardContent>
                <Typography>{alert.reason}</Typography>

                <Chip
                  label={alert.severity}
                  color={alert.severity === "high" ? "error" : "warning"}
                  style={{ marginRight: "10px" }}
                />

                <Chip
                  label={alert.resolved ? "Resolved" : "Pending"}
                  color={alert.resolved ? "success" : "warning"}
                />
              </CardContent>
            </Card>
          ))}

          {alerts.length === 0 && (
            <Typography align="center">No alerts available</Typography>
          )}
        </Paper>

      </Container>
    </div>
  );
}

export default Dashboard;