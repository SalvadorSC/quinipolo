import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Paper, Tooltip } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import styles from "./LeagueDashboard.module.scss";
import QuinipolosToAnswer from "../../Components/QuinipolosToAnswer/QuinipolosToAnswer";
import { useUser as useClerkUserData } from "@clerk/clerk-react";
import { useUser } from "../../Context/UserContext/UserContext";
import axios from "axios";

type LeaguesTypes = {
  quinipolosToAnswer: any[];
  leaguesToCorrect: any[];
  moderatorArray: string[];
  leagueName: string;
};

const LeagueDashboard = () => {
  const navigate = useNavigate();
  const [leagueData, setLeagueData] = useState<LeaguesTypes>({
    quinipolosToAnswer: [],
    leaguesToCorrect: [],
    moderatorArray: [],
    leagueName: "",
  });
  const queryParams = new URLSearchParams(window.location.search);
  const leagueId = queryParams.get("id");

  const clerkUserData = useClerkUserData();
  const { userData } = useUser();

  useEffect(() => {
    // Redirect to sign-in if not authenticated
    if (clerkUserData.isSignedIn === false) {
      navigate("/sign-in");
    } else {
      fetchLeagueData();
    }
  }, [navigate]);

  const fetchLeagueData = async () => {
    // Fetch data logic
    // Update leagueData state based on the fetched data
    axios.get(`/api/leagues/${leagueId}`).then(({ data }) => {
      setLeagueData({
        quinipolosToAnswer: data.quinipolosToAnswer,
        leaguesToCorrect: data.leaguesToCorrect,
        moderatorArray: data.moderatorArray,
        leagueName: data.leagueName,
      });
    });
  };

  const handleCreateQuinipolo = () => {
    // Logic to handle creation of new Quinipolo
    navigate("/crear-quinipolo");
  };

  const handleJoinLeague = () => {
    // Logic to handle joining a league
    navigate("/join-league");
  };

  // Additional helper functions as needed

  return (
    <div className={styles.leagueDashboardContainer}>
      <Paper elevation={3} sx={{ width: "100%", p: 4 }}>
        <h1 style={{ marginBottom: 20 }}>Liga {leagueData.leagueName}</h1>
        <QuinipolosToAnswer leagueId={leagueId ?? undefined} />
        <Tooltip
          title={
            leagueData.moderatorArray.find((user) => user === userData.username)
              ? ""
              : "Aún no puedes crear una quinipolo"
          }
        >
          <span>
            {`userData.username ${userData.username}`}
            {`leagueData.moderatorArray[0] ${leagueData.moderatorArray[0]}`}
            <LoadingButton
              variant="contained"
              style={{ margin: "20px 0" }}
              onClick={handleCreateQuinipolo}
              loading={!leagueData}
              disabled={!leagueData.moderatorArray.includes(userData.username)}
            >
              Crear una quinipolo{" "}
              {leagueData.moderatorArray.includes(userData.username).toString()}
            </LoadingButton>
          </span>
        </Tooltip>
        {/* Additional UI elements */}
      </Paper>
    </div>
  );

  // Add more state variables as needed
};

export default LeagueDashboard;
