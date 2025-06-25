import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { CircularProgress, Paper, Box } from "@mui/material";
import styles from "./Dashboard.module.scss";
import { LoadingButton } from "@mui/lab";
import QuinipolosToAnswer from "../../Components/QuinipolosToAnswer/QuinipolosToAnswer";
import { useUser as useUserData } from "../../Context/UserContext/UserContext";
import SportsVolleyballIcon from "@mui/icons-material/SportsVolleyball";
import WavesIcon from "@mui/icons-material/Waves";
import SportsBarIcon from "@mui/icons-material/SportsBar";
import PoolIcon from "@mui/icons-material/Pool";
import { useFeedback } from "../../Context/FeedbackContext/FeedbackContext";
import { Space } from "antd";
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
  const navigate = useNavigate();
  const { userData } = useUserData();
  const { setFeedback } = useFeedback();
  const [leagues, setLeagues] = useState<any[]>([]);
  const { t } = useTranslation();
  /* const [leagueImages, setLeagueImages] = useState<{ [key: string]: string }>(
    {}
  ); */

  /* useEffect(() => {
    const fetchImages = async () => {
      const images: { [key: string]: string } = {};
      for (const league of userData.leagues) {
        if (league.leagueImage) {
          images[league.leagueId] = league.leagueImage;
        } else if (league.hasImage) {
          const imageUrl = await apiGet<string>(
            `/api/leagues/images/${league.leagueId}`
          );
          images[league.leagueId] = imageUrl;
        }
      }
      setLeagueImages(images);
    };

    fetchImages();
  }, [userData.leagues]); */

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
      <Box
        sx={{
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
      </Box>
    );
  };

  const canCreateLeague = (role: string, leagues: any[]) => {
    if (role === "moderator" && leagues.length >= 1) {
      setFeedback({
        message: t('error'),
        severity: "error",
        open: true,
      });
      return false;
    }
    return true;
  };

  useEffect(() => {
    // this is to ensure that the global league is always the first one
    if (userData.leagues.length === 0) return;
    let leaguesArray = userData.leagues;

    leaguesArray.unshift(
      leaguesArray.splice(
        leaguesArray.findIndex((league) => league.leagueId === "global"),
        1
      )[0]
    );

    setLeagues(leaguesArray);
  }, [userData.leagues]);

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
            {t('leagues')}
          </h2>
          <QuinipolosToAnswer appLocation="user-dashboard" />
          <div className={styles.leaguesContainer}>
            <h2 className={styles.leaguesTitle}>{t('myLeagues')}</h2>
            <hr />
            {userData.role === "" ? (
              <CircularProgress sx={{ mt: 4 }} />
            ) : userData.leagues.length === 0 ? (
              <p className={styles.noActionsMessage}>
                No estas afiliado a ninguna liga.
              </p>
            ) : (
              <>
                {leagues.map((league) => (
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
                    <>
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
                      {/*  {leagueImages[league.leagueId] ? (
                        <img
                          style={{
                            maxHeight: "40px",
                            maxWidth: "40px",
                            margin: "0 10px",
                          }}
                          src={leagueImages[league.leagueId]}
                          alt={`Logo Liga ${league.leagueName}`}
                        />
                      ) : (
                        returnRandomIcon()
                      )} */}
                      <p
                        style={{
                          marginLeft: "20px",
                        }}
                      >
                        <b>{league.leagueName}</b>
                      </p>
                    </>
                  </Button>
                ))}
              </>
            )}
            <h2 className={styles.leaguesTitle}>{t('actions')}</h2>
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
              {t('viewAllLeagues')}
            </Button>

            <LoadingButton
              loading={userData.role === ""}
              variant="contained"
              color="primary"
              onClick={() => {
                /* if (
                  userData.role === "moderator" &&
                  !canCreateLeague(userData.role, userData.leagues)
                ) {
                  navigate("/subscribe");
                } else */ if (userData.role !== "moderator") {
                  setFeedback({
                    message: t('onlyModeratorsCanCreateLeagues'),
                    severity: "error",
                    open: true,
                  });
                  /* navigate("/subscribe"); */
                } else {
                  /* navigate("/crear-liga"); */
                  setFeedback({
                    message: t('featureTemporarilyDisabled'),
                    severity: "error",
                    open: true,
                  });
                }
              }}
              size="large"
              disabled={
                userData.role !== "moderator" && userData.leagues.length >= 1
              }
              style={{
                marginRight: "20px",
                width: "100%",
              }}
            >
              {t('createLeague')}
            </LoadingButton>
          </div>
        </div>
        {userData.role === "user" ? (
          <>
            {
              /* <Button
            startIcon={<WorkSpacePremiumIcon />}
            endIcon={<WorkSpacePremiumIcon />}
            variant="contained"
            color="warning"
            sx={{ mt: 4 }}
            onClick={() => navigate("/subscribe")}
          >
            Hazte PRO y ayuda al desarrollador
          </Button> */ <Space />
            }
          </>
        ) : null}
      </Paper>
    </div>
  );
};

export default Dashboard;
