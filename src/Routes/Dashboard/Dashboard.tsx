import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { CircularProgress, Paper, Tooltip } from "@mui/material";
import styles from "./Dashboard.module.scss";
import { LoadingButton } from "@mui/lab";
import QuinipolosToAnswer from "../../Components/QuinipolosToAnswer/QuinipolosToAnswer";
import { useUser as useUserData } from "../../Context/UserContext/UserContext";
import SportsVolleyballIcon from "@mui/icons-material/SportsVolleyball";
import WorkSpacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import WavesIcon from "@mui/icons-material/Waves";
import SportsBarIcon from "@mui/icons-material/SportsBar";
import PoolIcon from "@mui/icons-material/Pool";

const Dashboard = () => {
  const navigate = useNavigate();
  const { userData } = useUserData();

  const returnRandomIcon = () => {
    const iconStyle = {
      color: "#3f51b5",
    };
    const icons = [
      <SportsVolleyballIcon key="SportsVolleyball" style={iconStyle} />,
      <WavesIcon key={"Waves"} style={iconStyle} />,
      <SportsBarIcon key="SportsBar" style={iconStyle} />,
      <PoolIcon key="Pool" style={iconStyle} />,
    ];
    return (
      <div
        style={{
          marginLeft: "10px",
          width: "40px",
          background: "#ddd",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "40px",
          borderRadius: "50%",
        }}
      >
        {icons[Math.floor(Math.random() * icons.length)]}
      </div>
    );
  };

  return (
    <div className={styles.dashboardContainer}>
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          p: window.innerWidth > 400 ? 4 : 2,
          borderRadius: "20px",
        }}
      >
        <div className={styles.container}>
          <h2 className={styles.leaguesTitle} style={{ marginTop: 0 }}>
            Quinipolos
          </h2>
          <QuinipolosToAnswer appLocation="user-dashboard" />
          <div className={styles.leaguesContainer}>
            <h2 className={styles.leaguesTitle}>Mis ligas</h2>
            <hr />
            {userData.role === "" ? (
              <CircularProgress sx={{ mt: 4 }} />
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
                        width: "100%",
                        marginTop: "20px",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        padding: "10px",
                        minHeight: "60px",
                      }}
                      key={league.leagueId}
                      onClick={() => {
                        navigate(`/league-dashboard?id=${league.leagueId}`);
                      }}
                      variant={"contained"}
                    >
                      {league.leagueImage ? (
                        <img
                          style={{
                            maxHeight: "40px",
                            maxWidth: "40px",
                            margin: "0 10px",
                          }}
                          src={league.leagueImage}
                          alt={`Logo Liga ${league.leagueName}`}
                        />
                      ) : (
                        returnRandomIcon()
                      )}

                      <p
                        style={{
                          marginLeft: "20px",
                        }}
                      >
                        <b>{league.leagueName}</b>
                      </p>
                    </Button>
                  );
                })}
              </>
            )}
            <h2 className={styles.leaguesTitle}>Acciones</h2>
            <hr />

            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => {
                navigate("/join-league");
              }}
              style={{ margin: "20px  0", width: "100%" }}
            >
              Ver todas las ligas
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
        </div>
        {userData.role === "user" ? (
          <Button
            startIcon={<WorkSpacePremiumIcon />}
            endIcon={<WorkSpacePremiumIcon />}
            variant="contained"
            color="warning"
            sx={{ mt: 4 }}
            onClick={() => navigate("/subscribe")}
          >
            Quitar anuncios y ayudar al desarrollador
          </Button>
        ) : null}
      </Paper>
    </div>
  );
};

export default Dashboard;
