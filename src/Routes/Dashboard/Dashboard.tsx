import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { CircularProgress, Paper, Tooltip } from "@mui/material";
import styles from "./Dashboard.module.scss";
import axios from "axios";
import { LoadingButton } from "@mui/lab";
import QuinipolosToAnswer from "../../Components/QuinipolosToAnswer/QuinipolosToAnswer";
import { useFeedback } from "../../Context/FeedbackContext/FeedbackContext";
import { useUser as useUserData } from "../../Context/UserContext/UserContext";
import { useUser } from "@clerk/clerk-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { userData, updateUser: updateUserData } = useUserData();
  const { setFeedback } = useFeedback();

  const { user } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      if (userData.isRegistered) {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/api/user/data/${
              user!.username
            }`
          );
          updateUserData({
            role: response.data.role,
            leagues: response.data.leagues,
            quinipolosToAnswer: response.data.quinipolosToAnswer,
            moderatedLeagues: response.data.moderatedLeagues,
            username: user?.username as string,
            emailAddress: user!.primaryEmailAddress?.emailAddress as string,
          });
        } catch (error) {
          console.error(error);
          setFeedback({
            message: "Error cargando los datos del usuario",
            severity: "error",
            open: true,
          });
        }
      }
    };

    fetchData();
  }, [userData.isRegistered]);

  return (
    <div className={styles.dashboardContainer}>
      <Paper elevation={3} sx={{ width: "100%", p: 4 }}>
        <div className={styles.container}>
          <QuinipolosToAnswer />
          <div className={styles.leaguesContainer}>
            <h2 className={styles.leaguesTitle}>Mis ligas</h2>
            <hr />
            {userData.role === "" ? (
              <CircularProgress />
            ) : userData.leagues.length === 0 ? (
              <p className={styles.noActionsMessage}>
                No estas afiliado a ninguna liga.
              </p>
            ) : (
              <>
                {userData.leagues.map((league) => {
                  return (
                    <Button
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        marginTop: "20px",
                      }}
                      key={league}
                      onClick={() => {
                        alert(`/league-dashboard?id=${league}`);
                        navigate(`/league-dashboard?id=${league}`);
                      }}
                      variant={"contained"}
                    >
                      <p>{league}</p>
                    </Button>
                  );
                })}
              </>
            )}
            <Button
              variant="contained"
              color="primary"
              size="large"
              disabled
              onClick={() => {
                navigate("/quinipolo");
              }}
              style={{ margin: "20px  0", width: "100%" }}
            >
              Unirme a una Liga
            </Button>
            <Tooltip
              arrow
              title={
                "Por ahora no se permite crear ninguna liga." /* &&
                userData === "" &&
                "Cargando permisos del usuario...") ||
              (userData !== "moderator" &&
                "Solo los moderadores pueden crear Ligas") */
              }
            >
              <span>
                <LoadingButton
                  loading={userData.role === ""}
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    navigate("/crear-liga");
                  }}
                  size="large"
                  disabled={/* userData !== "moderator" */ true}
                  style={{
                    marginRight: "20px",
                    width: "100%",
                  }}
                >
                  Crear una liga
                </LoadingButton>
              </span>
            </Tooltip>
          </div>

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
