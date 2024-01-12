import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { Paper, Tooltip } from "@mui/material";
import styles from "./Dashboard.module.scss";
import axios from "axios";
import { LoadingButton } from "@mui/lab";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userPermissions, setUserPermissions] = React.useState("");
  const username = localStorage.getItem("username");
  useEffect(() => {
    if (localStorage.getItem("authenticated") !== "true") {
      navigate("/sign-in");
    } else {
      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/api/user/role/${username}`)
        .then((response) => {
          setUserPermissions(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [navigate, username]);

  return (
    <div className={styles.dashboardContainer}>
      <Paper elevation={3} sx={{ width: "100%", p: 4 }}>
        <div>
          <Tooltip
            arrow
            title={
              (userPermissions === "" && "Cargando permisos del usuario...") ||
              (userPermissions !== "moderator" &&
                "Solo los moderadores pueden crear Quinipolos")
            }
          >
            <span>
              <LoadingButton
                loading={userPermissions === ""}
                variant="contained"
                color="primary"
                onClick={() => {
                  navigate("/crear-quinipolo");
                }}
                size="large"
                disabled={userPermissions !== "moderator"}
                style={{ marginRight: "20px", width: "100%" }}
              >
                Crear una quinipolo
              </LoadingButton>
            </span>
          </Tooltip>
          <Tooltip
            arrow
            title={
              "Por ahora no se permite crear ninguna liga." /* &&
                userPermissions === "" &&
                "Cargando permisos del usuario...") ||
              (userPermissions !== "moderator" &&
                "Solo los moderadores pueden crear Ligas") */
            }
          >
            <span>
              <LoadingButton
                loading={userPermissions === ""}
                variant="contained"
                color="primary"
                onClick={() => {
                  navigate("/crear-liga");
                }}
                size="large"
                disabled={/* userPermissions !== "moderator" */ true}
                style={{
                  marginRight: "20px",
                  marginTop: "20px",
                  width: "100%",
                }}
              >
                Crear una liga
              </LoadingButton>
            </span>
          </Tooltip>

          <Button
            variant="contained"
            color="primary"
            size="large"
            disabled
            onClick={() => {
              navigate("/quinipolo");
            }}
            style={{ marginRight: "20px", marginTop: "20px", width: "100%" }}
          >
            Unirme a una Liga
          </Button>

          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => {
              navigate("/quinipolo");
            }}
            style={{ marginRight: "20px", marginTop: "20px", width: "100%" }}
          >
            Responder una quinipolo
          </Button>

          {/* <Link to="/user/preferences" style={{ textDecoration: "none" }}>
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
          </Link> */}

          {/* Add more buttons/routes as needed */}
        </div>
      </Paper>
    </div>
  );
};

export default Dashboard;
