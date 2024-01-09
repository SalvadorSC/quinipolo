import React from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";

const Dashboard = () => {
  return (
    <div>
      <div style={{ padding: "20px" }}>
        {/* Big buttons for each route */}
        <Link to="/user/preferences" style={{ textDecoration: "none" }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            style={{ marginRight: "20px" }}
          >
            User Preferences
          </Button>
        </Link>
        <Link to="/my-leagues" style={{ textDecoration: "none" }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            style={{ marginRight: "20px" }}
          >
            My Leagues
          </Button>
        </Link>
        <Link to="/notifications" style={{ textDecoration: "none" }}>
          <Button variant="contained" color="primary" size="large">
            Notifications
          </Button>
        </Link>

        {/* Add more buttons/routes as needed */}
      </div>
    </div>
  );
};

export default Dashboard;
