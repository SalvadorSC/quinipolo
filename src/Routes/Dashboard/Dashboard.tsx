import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { CircularProgress, Paper, Box } from "@mui/material";
import styles from "./Dashboard.module.scss";
import { LoadingButton } from "@mui/lab";
import QuinipolosToAnswer from "../../Components/QuinipolosToAnswer/QuinipolosToAnswer";
import { UserDataType, useUser as useUserData } from "../../Context/UserContext/UserContext";
import SportsVolleyballIcon from "@mui/icons-material/SportsVolleyball";
import WavesIcon from "@mui/icons-material/Waves";
import SportsBarIcon from "@mui/icons-material/SportsBar";
import PoolIcon from "@mui/icons-material/Pool";
import { useFeedback } from "../../Context/FeedbackContext/FeedbackContext";
import { Space } from "antd";
import { useTranslation } from 'react-i18next';
import { apiGet } from "../../utils/apiUtils";

const Dashboard = () => {
  const navigate = useNavigate();
  const { userData, updateUser } = useUserData();
  const { setFeedback } = useFeedback();
  const [leagues, setLeagues] = useState<{leagueId: string, leagueName: string, participants: string[]}[]>([]);
  const { t } = useTranslation();
  const [hasFetchedProfile, setHasFetchedProfile] = useState(false);


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
    if (!hasFetchedProfile && (!userData.leagues || userData.leagues.length === 0)) {
      apiGet<UserDataType>('/api/users/me/profile').then(profile => {
        const leagues = profile.leagues || [];
        leagues.sort((a, b) => (a.leagueId === "global" ? -1 : b.leagueId === "global" ? 1 : 0));
        updateUser({ leagues, role: profile.role, username: profile.username });
        setHasFetchedProfile(true);
      });
    }
  }, [userData.leagues, updateUser, hasFetchedProfile]);

  const getLeaguesData = async () => {
    const leaguesData = await Promise.all(userData.leagues.map(league => {
      return apiGet<any>(`/api/leagues/${league}`).then(leagueData => {
        return leagueData;
      });
    }));
   
    const leaguesWithData = leaguesData.map(league => {
      return {
        leagueId: league.id,
        leagueName: league.league_name,
        participants: league.participants,
      }
    });
    setLeagues(leaguesWithData);
  }

  useEffect(() => {
    if (userData.leagues.length > 0) {
      getLeaguesData();
    }
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
        <h1>Welcome {userData.username}</h1>
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
                {t('noLeagues')}
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
                      {returnRandomIcon()}
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
