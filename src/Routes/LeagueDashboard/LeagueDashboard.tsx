import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgress, Paper, Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import styles from "./LeagueDashboard.module.scss";
import QuinipolosToAnswer from "../../Components/QuinipolosToAnswer/QuinipolosToAnswer";
import { useUser as useClerkUserData } from "@clerk/clerk-react";
import { useUser } from "../../Context/UserContext/UserContext";
import { useFeedback } from "../../Context/FeedbackContext/FeedbackContext";
import { apiGet, apiPost } from "../../utils/apiUtils";
import Leaderboard from "../../Components/Leaderboard/Leaderboard";
import RequestsTable from "../../Components/RequestsTable/RequestsTable";
export type LeaguesTypes = {
  quinipolosToAnswer: any[];
  leaguesToCorrect: any[];
  moderatorArray: string[];
  leagueName: string;
  isPrivate: boolean;
  moderatorPetitions: {
    userId: string;
    username: string;
    date: Date;
    _id: string;
    status: "pending" | "accepted" | "rejected" | "cancelled";
  }[];
  participantPetitions: {
    userId: string;
    username: string;
    date: Date;
    _id: string;
    status: "pending" | "accepted" | "rejected" | "cancelled";
  }[];
  participants: {
    username: string;
    puntos: number;
  }[];
};

type LeaderboardScore = {
  username: string;
  nQuinipolosParticipated: number;
  points: number;
  fullCorrectQuinipolos: number;
};

const LeagueDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [leagueData, setLeagueData] = useState<LeaguesTypes>({
    quinipolosToAnswer: [],
    leaguesToCorrect: [],
    moderatorArray: [],
    leagueName: "",
    moderatorPetitions: [],
    participantPetitions: [],
    participants: [],
    isPrivate: false,
  });
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [isUserModeratorInThisLeague, setIsUserModeratorInThisLeague] =
    useState<boolean>(false);
  const queryParams = new URLSearchParams(window.location.search);
  const leagueId = queryParams.get("id");
  const { setFeedback } = useFeedback();

  const { isSignedIn } = useClerkUserData();
  const { userData } = useUser();

  const getLeagueData = async () => {
    apiGet(`/api/leagues/${leagueId}`)
      .then((data: any) => {
        setLeagueData({
          quinipolosToAnswer: data.quinipolosToAnswer,
          leaguesToCorrect: data.leaguesToCorrect,
          moderatorArray: data.moderatorArray,
          leagueName: data.leagueName,
          moderatorPetitions: data.moderatorPetitions,
          participantPetitions: data.participantPetitions,
          participants: data.participants,
          isPrivate: data.isPrivate,
        });
        if (userData.username !== "") {
          setIsUserModeratorInThisLeague(
            data.moderatorArray?.includes(userData.username)
          );
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setFeedback({
          message: "Error cargando los datos de la liga",
          severity: "error",
          open: true,
        });
        setLoading(false);
      });
  };

  const getLeagueLeaderBoardData = async () => {
    apiGet(`/api/leagues/${leagueId}/leaderboard`)
      .then((data: any) => {
        const transformedLeaderboardData = data.participantsLeaderboard.map(
          (score: LeaderboardScore) => {
            return {
              username: score.username,
              nQuinipolosParticipated: score.nQuinipolosParticipated,
              totalPoints: score.points,
              fullCorrectQuinipolos: score.fullCorrectQuinipolos,
            };
          }
        );

        setLeaderboardData(
          transformedLeaderboardData.sort(
            (a: LeaderboardScore, b: LeaderboardScore) => b.points - a.points
          )
        );
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setFeedback({
          message: "Error cargando los datos de la liga",
          severity: "error",
          open: true,
        });
        setLoading(false);
      });
  };

  useEffect(() => {
    const fetchLeagueData = async () => {
      setLoading(true);
      getLeagueData();
      getLeagueLeaderBoardData();
    };

    // Redirect to sign-in if not authenticated
    if (isSignedIn === false) {
      navigate("/sign-in");
    } else {
      fetchLeagueData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSolicitarPermisos = () => {
    console.log("started loading");
    setLoading(true);
    // set feedback on success and on error
    apiPost(`/api/leagues/${leagueId}/request-moderator`, {
      userId: userData.userId,
      username: userData.username,
    })
      .then(() => {
        setFeedback({
          message: "Permisos solicitados!",
          severity: "success",
          open: true,
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setFeedback({
          message: "Error solicitando permisos",
          severity: "error",
          open: true,
        });
        setLoading(false);
      });
  };

  const handleBasicActionButtonClick = () => {
    if (!isUserModeratorInThisLeague) {
      handleSolicitarPermisos();
      return;
    }
    // Logic to handle creation of new Quinipolo
    navigate(`/crear-quinipolo?leagueId=${leagueId}`);
  };

  return (
    <div className={styles.leagueDashboardContainer}>
      <Paper elevation={3} sx={{ width: "100%", p: 4, borderRadius: "20px" }}>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <h1 className={styles.leagueTitle}>
                Liga {leagueData.leagueName}
              </h1>

              {isUserModeratorInThisLeague ||
              !leagueData.moderatorPetitions.find(
                (petition) => petition.username === userData.username
              ) ? (
                <span>
                  <LoadingButton
                    variant="contained"
                    style={{ margin: "20px 0" }}
                    onClick={handleBasicActionButtonClick}
                    loading={!leagueData || loading}
                  >
                    {isUserModeratorInThisLeague
                      ? "Crear una quinipolo"
                      : "Solicitar permisos de moderador"}
                  </LoadingButton>
                </span>
              ) : null}
            </div>

            <QuinipolosToAnswer
              wrapperLoading={loading}
              leagueId={leagueId!}
              appLocation="league-dashboard"
            />
            <Stack>
              <h2 className={styles.actionsTitle}>Clasificación</h2>
              <hr style={{ marginBottom: 16 }} />
              <Leaderboard sortedResults={leaderboardData} />
            </Stack>
            {isUserModeratorInThisLeague ? (
              <>
                <h2 className={styles.actionsTitle}>Acciones</h2>
                <hr style={{ marginBottom: 16 }} />
                {leagueData.isPrivate ? (
                  <RequestsTable
                    leagueId={leagueId!}
                    requests={leagueData.participantPetitions.filter(
                      (petition) => petition.status === "pending"
                    )}
                    setLeagueData={setLeagueData}
                    requestType="participant"
                  />
                ) : null}
                <RequestsTable
                  leagueId={leagueId!}
                  requests={leagueData.moderatorPetitions.filter(
                    (petition) => petition.status === "pending"
                  )}
                  setLeagueData={setLeagueData}
                  requestType="moderator"
                />
              </>
            ) : null}
          </>
        )}
      </Paper>
    </div>
  );

  // Add more state variables as needed
};

export default LeagueDashboard;
