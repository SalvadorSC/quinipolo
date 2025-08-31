import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import styles from "./LeagueList.module.scss";
import { useUser } from "../../Context/UserContext/UserContext";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { apiGet, apiPost, apiPut } from "../../utils/apiUtils";
import { useFeedback } from "../../Context/FeedbackContext/FeedbackContext";
import LockIcon from "@mui/icons-material/Lock";
import { useTranslation } from "react-i18next";
import { isSystemAdmin } from "../../utils/moderatorUtils";

type LeagueParticipant = {
  user_id: string;
  username: string;
  role: string;
};

type LeaguePetition = {
  userId: string;
  username: string;
  status: string;
  date: string;
};

type LeaguesTypes = {
  // DB fields
  id: string;
  league_name: string;
  created_at?: string;
  created_by?: string;
  tier?: string;
  status?: string;
  is_private: boolean;
  current_participants?: number;
  updated_at?: string;
  description?: string | null;

  // Enriched fields from API
  participants: LeagueParticipant[];
  participantsCount?: number;
  participantPetitions: LeaguePetition[];
  moderatorPetitions?: LeaguePetition[];
  moderatorArray: string[];
  quinipolosToAnswer: any[];
  leaguesToCorrect: any[];

  // Some endpoints (e.g., create) may return camelCase
  isPrivate?: boolean;
};

const LeagueList = () => {
  const navigate = useNavigate();
  const [leagueListData, setLeagueListData] = useState<LeaguesTypes[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { setFeedback } = useFeedback();
  const { t } = useTranslation();

  const { userData } = useUser();

  // Helper function to check if user is in a league
  const isUserInLeague = (league: LeaguesTypes) => {
    return league.participants.some(
      (participant) => participant.username === userData.username
    );
  };

  // Helper function to check if user has a pending petition
  const hasPendingPetition = (league: LeaguesTypes) => {
    return league.participantPetitions.some(
      (petition) =>
        petition.username === userData.username && petition.status === "pending"
    );
  };

  const fetchLeagueListData = useCallback(async () => {
    // Mock data for screenshot purposes
    const mockLeagues: LeaguesTypes[] = [
      {
        id: "global",
        league_name: "Global",
        created_at: "2024-01-01T00:00:00Z",
        created_by: "system",
        tier: "managed",
        status: "active",
        is_private: false,
        current_participants: 57,
        updated_at: "2024-12-01T00:00:00Z",
        description: "Liga global para todos los usuarios",
        participants: [
          {
            user_id: userData.userId,
            username: userData.username,
            role: "user",
          },
          ...Array.from({ length: 56 }, (_, i) => ({
            user_id: `user${i + 1}`,
            username: `user${i + 1}`,
            role: "user",
          })),
        ],
        participantsCount: 57,
        participantPetitions: [],
        moderatorPetitions: [],
        moderatorArray: ["admin1"],
        quinipolosToAnswer: [],
        leaguesToCorrect: [],
      },
      {
        id: "personal",
        league_name: "Tu liga personalizada",
        created_at: "2024-06-15T00:00:00Z",
        created_by: "user1",
        tier: "self-managed",
        status: "active",
        is_private: true,
        current_participants: 17,
        updated_at: "2024-12-15T00:00:00Z",
        description: "Liga personalizada para amigos cercanos",
        participants: [
          { user_id: "user1", username: "user1", role: "creator" },
          {
            user_id: userData.userId,
            username: userData.username,
            role: "user",
          },
          ...Array.from({ length: 15 }, (_, i) => ({
            user_id: `user${i + 4}`,
            username: `user${i + 4}`,
            role: "user",
          })),
        ],
        participantsCount: 17,
        participantPetitions: [],
        moderatorPetitions: [],
        moderatorArray: ["user1"],
        quinipolosToAnswer: [],
        leaguesToCorrect: [],
      },
      {
        id: "rival",
        league_name: "La liga de tus rivales",
        created_at: "2024-08-20T00:00:00Z",
        created_by: "user2",
        tier: "self-managed",
        status: "active",
        is_private: true,
        current_participants: 19,
        updated_at: "2024-12-10T00:00:00Z",
        description: "Liga de rivales deportivos",
        participants: [
          { user_id: "user2", username: "user2", role: "creator" },
          ...Array.from({ length: 18 }, (_, i) => ({
            user_id: `user${i + 6}`,
            username: `user${i + 6}`,
            role: "user",
          })),
        ],
        participantsCount: 19,
        participantPetitions: [],
        moderatorPetitions: [],
        moderatorArray: ["user2"],
        quinipolosToAnswer: [],
        leaguesToCorrect: [],
      },
    ];

    // Sort leagues: Global first, then alphabetically
    const sortedData = mockLeagues.sort((a, b) => {
      // Global league should always be first
      if (a.league_name.toLowerCase() === "global") return -1;
      if (b.league_name.toLowerCase() === "global") return 1;

      // All other leagues sorted alphabetically
      return a.league_name.localeCompare(b.league_name);
    });

    setLeagueListData(sortedData);
    setLoading(false);
  }, [setFeedback]);

  const handleJoinLeague = (index: number) => {
    // Logic to handle joining a league
    if (
      leagueListData?.[index] &&
      (isUserInLeague(leagueListData[index]) || isSystemAdmin(userData.role))
    ) {
      navigate("/league-dashboard?id=" + leagueListData[index].id);
    } else if (leagueListData?.[index]?.is_private) {
      apiPost(
        `/api/leagues/${leagueListData?.[index].id}/request-participant`,
        {
          userId: userData.userId,
          username: userData.username,
        }
      )
        .then((data: any) => {
          setLeagueListData(data);
          setFeedback({
            message: t("requestSent"),
            severity: "success",
            open: true,
          });
        })
        .catch((error) => {
          console.log(error);
          setFeedback({
            message: t("errorJoiningLeague"),
            severity: "error",
            open: true,
          });
        });
    } else {
      apiPut(`/api/leagues/${leagueListData[index].id}/join`, {
        leagueId: leagueListData[index].id,
        username: userData.username,
      })
        .then((data) => {
          setLeagueListData((prevData) => {
            const newData = [...prevData];
            newData[index].participants.push({
              user_id: userData.userId,
              username: userData.username,
              role: "user",
            });
            return newData;
          });
          setFeedback({
            message: t("joinedLeague"),
            severity: "success",
            open: true,
          });
        })

        .catch((error) => {
          console.log(error);
          setFeedback({
            message: t("errorJoiningLeague"),
            severity: "error",
            open: true,
          });
        });
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchLeagueListData();
  }, [fetchLeagueListData]);

  return (
    <div className={styles.leagueListContainer}>
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          p: 2,
          pt: 4,
          pb: 4,
          borderRadius: "20px",
          marginBottom: "100px",
        }}
      >
        <h1 style={{ marginBottom: 20 }}>{t("leagues")}</h1>
        {loading || leagueListData.length === 0 ? (
          <CircularProgress sx={{ m: 4 }} />
        ) : (
          <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>{t("name")}</TableCell>
                  <TableCell align="center">
                    <EmojiPeopleIcon />
                  </TableCell>
                  <TableCell align="center">
                    <LockIcon />
                  </TableCell>
                  <TableCell align="center">
                    <MoreHorizIcon />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leagueListData?.map((league) => (
                  <TableRow
                    key={league.league_name}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell
                      style={{ fontWeight: "bold" }}
                      component="th"
                      scope="row"
                    >
                      {league.league_name}
                    </TableCell>
                    <TableCell
                      style={{ paddingLeft: 0, paddingRight: 0 }}
                      align="center"
                    >
                      {league.participants.length}
                    </TableCell>
                    <TableCell align="left">
                      {league.is_private ? t("private") : t("public")}
                    </TableCell>
                    <TableCell align="left">
                      <Tooltip
                        title={
                          isUserInLeague(league)
                            ? t("goToLeague")
                            : hasPendingPetition(league)
                            ? t("pendingRequest")
                            : t("joinLeague")
                        }
                      >
                        <LoadingButton
                          variant="contained"
                          style={{
                            minWidth: "fit-content",
                            width: "100%",
                            justifyContent: "flex-start",
                            textAlign: "left",
                          }}
                          className={`gradient-primary`}
                          onClick={() =>
                            handleJoinLeague(leagueListData?.indexOf(league))
                          }
                          loading={!leagueListData}
                          disabled={hasPendingPetition(league)}
                        >
                          {isUserInLeague(league) ||
                          isSystemAdmin(userData.role)
                            ? t("go")
                            : hasPendingPetition(league)
                            ? t("pending")
                            : t("join")}
                        </LoadingButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </div>
  );

  // Add more state variables as needed
};

export default LeagueList;
