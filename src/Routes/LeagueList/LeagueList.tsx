import React, { useCallback, useEffect, useState } from "react";
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
import { useTranslation } from 'react-i18next';

type LeaguesTypes = {
  quinipolosToAnswer: any[];
  leaguesToCorrect: any[];
  moderatorArray: string[];
  league_name: string;
  id: string;
  participants: string[];
  isPrivate: boolean;
  participantPetitions: {
    userId: string;
    username: string;
    status: string;
    date: Date;
  }[];
};

const LeagueList = () => {
  const navigate = useNavigate();
  const [leagueListData, setLeagueListData] = useState<LeaguesTypes[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(true);
  const { setFeedback } = useFeedback();
  const { t } = useTranslation();

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
      navigate("/league-dashboard?id=" + leagueListData[index].id);
    } else if (leagueListData?.[index]?.isPrivate) {
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
            message: "Solicitud enviada",
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
    } else {
      apiPut(`/api/leagues/${leagueListData[index].id}/join`, {
        leagueId: leagueListData[index].id,
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
        <h1 style={{ marginBottom: 20 }}>{t('leagues')}</h1>
        {/* {participantIsInMoreThan2Leagues ? (
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
        ) : null} */}
        {loading || leagueListData.length === 0 ? (
          <CircularProgress sx={{ m: 4 }} />
        ) : (
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>{t('name')}</TableCell>
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
                    <TableCell component="th" scope="row">
                      {league.league_name}
                    </TableCell>
                    <TableCell
                      style={{ paddingLeft: 0, paddingRight: 0 }}
                      align="center"
                    >
                      {league.participants.length}
                    </TableCell>
                    <TableCell align="left">
                      {league.isPrivate ? t('private') : t('public')}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip
                        title={
                          league.participants.includes(userData.username)
                            ? t('goToLeague')
                            : league.participantPetitions.find((petition) => {
                                return petition.username === userData.username;
                              })
                            ? t('pendingRequest')
                            : t('joinLeague')
                        }
                      >
                        <LoadingButton
                          variant="contained"
                          style={{ width: "80px" }}
                          onClick={() => handleJoinLeague(leagueListData?.indexOf(league))}
                          loading={!leagueListData}
                          /* disabled={
                            !league.participants.includes(
                              userData.username
                            ) &&
                            participantIsInMoreThan2Leagues
                          } */
                        >
                          {league.participants.includes(userData.username)
                            ? t('go')
                            : league.participantPetitions.find((petition) => {
                                return petition.username === userData.username;
                              })
                            ? t('pending')
                            : t('join')}
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
