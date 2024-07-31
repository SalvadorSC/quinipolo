import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Collapse,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import styles from "./LeagueList.module.scss";
import { useUser } from "../../Context/UserContext/UserContext";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { apiGet, apiPut } from "../../utils/apiUtils";
import WorkSpacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import { useFeedback } from "../../Context/FeedbackContext/FeedbackContext";
import LockIcon from "@mui/icons-material/Lock";
type LeaguesTypes = {
  quinipolosToAnswer: any[];
  leaguesToCorrect: any[];
  moderatorArray: string[];
  leagueName: string;
  leagueId: string;
  participants: string[];
  isPrivate: boolean;
};

const LeagueList = () => {
  const navigate = useNavigate();
  const [leagueListData, setLeagueListData] = useState<LeaguesTypes[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(true);
  const { setFeedback } = useFeedback();

  const { userData } = useUser();

  const participantIsInMoreThan2Leagues =
    leagueListData.filter((league) =>
      league.participants.includes(userData.username)
    ).length > 2 && userData.role === "user";

  const fetchLeagueListData = useCallback(async () => {
    // Fetch data logic
    apiGet<LeaguesTypes[]>(`/api/leagues`)
      .then((data) => {
        setLeagueListData(data);
      })
      .catch((error) => {
        console.log(error);
        setFeedback({
          message: "Error cargando los datos de la liga",
          severity: "error",
          open: true,
        });
      });
    setLoading(false);
  }, [setFeedback]);

  const handleJoinLeague = (index: number) => {
    // Logic to handle joining a league
    if (leagueListData?.[index]?.participants.includes(userData.username)) {
      navigate("/league-dashboard?id=" + leagueListData[index].leagueId);
    } else if (leagueListData?.[index]?.isPrivate) {
      // make api call to join private league
    } else {
      apiPut(`/api/leagues/${leagueListData[index].leagueId}/join`, {
        leagueId: leagueListData[index].leagueId,
        username: userData.username,
      })
        .then((data) => {
          setLeagueListData((prevData) => {
            const newData = [...prevData];
            newData[index].participants.push(userData.username);
            return newData;
          });
          setFeedback({
            message: "Te has unido a la liga",
            severity: "success",
            open: true,
          });
        })

        .catch((error) => {
          console.log(error);
          setFeedback({
            message: "Error al unirse a la liga",
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
      <Paper elevation={3} sx={{ width: "100%", p: 4, borderRadius: "20px" }}>
        <h1 style={{ marginBottom: 20 }}>Ligas actuales</h1>
        {participantIsInMoreThan2Leagues ? (
          <Collapse in={open}>
            <Alert
              severity={"warning"}
              onClick={() => {
                setOpen(false);
              }}
            >
              <Box
                display={{ sm: "flex", md: "flex" }}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Typography variant="body1">
                  Debes ser usuario <b>PRO</b> o <b>Moderador</b> para
                  pertenecer a más de 2 ligas
                </Typography>
                <Button
                  startIcon={<WorkSpacePremiumIcon />}
                  endIcon={<WorkSpacePremiumIcon />}
                  variant="contained"
                  color="warning"
                  sx={{ ml: { sm: 0, md: 2 }, mt: { xs: 2, sm: 2, md: 0 } }}
                  size="small"
                  onClick={() => navigate("/subscribe")}
                >
                  Hacerse PRO
                </Button>
              </Box>
            </Alert>
          </Collapse>
        ) : null}
        {loading || leagueListData.length === 0 ? (
          <CircularProgress sx={{ m: 4 }} />
        ) : (
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell align="right">
                    <EmojiPeopleIcon />
                  </TableCell>
                  <TableCell align="right">
                    <LockIcon />
                  </TableCell>
                  <TableCell align="right">
                    <MoreHorizIcon />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leagueListData?.map((league) => (
                  <TableRow
                    key={league.leagueName}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {league.leagueName}
                    </TableCell>
                    <TableCell align="right">
                      {league.participants.length}
                    </TableCell>
                    <TableCell align="right">
                      {league.isPrivate ? "Liga privada" : "Liga pública"}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip
                        title={
                          league.participants.includes(userData.username)
                            ? "Ir a la liga"
                            : "Unirse a la liga"
                        }
                      >
                        <LoadingButton
                          variant="contained"
                          onClick={() =>
                            handleJoinLeague(leagueListData?.indexOf(league))
                          }
                          loading={!leagueListData}
                          disabled={
                            !league.participants.includes(userData.username) &&
                            participantIsInMoreThan2Leagues
                          }
                        >
                          {league.participants.includes(userData.username)
                            ? "Ir"
                            : "Unirse"}
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
