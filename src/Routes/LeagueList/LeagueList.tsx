import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
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
import { useUser as useClerkUserData } from "@clerk/clerk-react";
import { useUser } from "../../Context/UserContext/UserContext";
import axios from "axios";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
type LeaguesTypes = {
  quinipolosToAnswer: any[];
  leaguesToCorrect: any[];
  moderatorArray: string[];
  leagueName: string;
  leagueId: string;
  participants: string[];
};

const LeagueList = () => {
  const navigate = useNavigate();
  const [leagueList, setLeagueList] = useState<LeaguesTypes[]>([
    {
      quinipolosToAnswer: [],
      leaguesToCorrect: [],
      moderatorArray: [],
      leagueName: "",
      participants: [],
      leagueId: "",
    },
  ]);
  const queryParams = new URLSearchParams(window.location.search);
  const leagueId = queryParams.get("id");

  const clerkUserData = useClerkUserData();
  const { userData } = useUser();

  useEffect(() => {
    // Redirect to sign-in if not authenticated
    if (clerkUserData.isSignedIn === false) {
      navigate("/sign-in");
    } else {
      fetchLeagueListData();
    }
  }, [clerkUserData.isSignedIn, navigate]);

  const fetchLeagueListData = async () => {
    // Fetch data logic
    axios.get(`/api/leagues`).then(({ data }) => {
      setLeagueList(data);
    });
  };

  const handleJoinLeague = (index: number) => {
    // Logic to handle joining a league
    if (leagueList[index].participants.includes(userData.username)) {
      navigate("/league-dashboard");
    } else {
      axios
        .post(`/api/leagues/${leagueList[index].leagueId}/join`, {
          leagueId: leagueList[index].leagueId,
          username: userData.username,
        })
        .then(({ data }) => {
          setLeagueList(data);
        });
    }
  };

  // Additional helper functions as needed

  return (
    <div className={styles.leagueListContainer}>
      <Paper elevation={3} sx={{ width: "100%", p: 4 }}>
        <h1 style={{ marginBottom: 20 }}>Ligas actuales</h1>

        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell align="right">
                  <EmojiPeopleIcon />
                </TableCell>
                <TableCell align="right">
                  <MoreHorizIcon />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leagueList.map((league) => (
                <TableRow
                  key={league.leagueName}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {league.leagueName}
                  </TableCell>
                  <TableCell align="right">
                    {league.participants.length}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Unirse a la liga">
                      <LoadingButton
                        variant="contained"
                        onClick={() =>
                          handleJoinLeague(leagueList.indexOf(league))
                        }
                        loading={!leagueList[0]}
                        disabled={false}
                      >
                        {league.participants.includes(userData.username)
                          ? "Ver "
                          : "Unirse"}
                      </LoadingButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );

  // Add more state variables as needed
};

export default LeagueList;
