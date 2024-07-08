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
  const [leagueListData, setLeagueListData] = useState<LeaguesTypes[]>([
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

  const fetchLeagueListData = async () => {
    // Fetch data logic
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/leagues`).then(({ data }) => {
      setLeagueListData(data);
    });
  };

  /*  const handleJoinLeague = (index: number) => {
    // Logic to handle joining a league
    if (leagueListData?.[index]?.participants.includes(userData.username)) {
      navigate("/league-dashboard");
    } else {
      axios
        .post(`${process.env.REACT_APP_API_BASE_URL}/api/leagues/${leagueListData[index].leagueId}/join`, {
          leagueId: leagueListData[index].leagueId,
          username: userData.username,
        })
        .then(({ data }) => {
          setLeagueListData(data);
        });
    }
  };
 */
  useEffect(() => {
    fetchLeagueListData();
  }, []);

  console.log(leagueListData);

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
              {leagueListData
                ? leagueListData.map((league) => (
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
                            /* onClick={() =>
                              handleJoinLeague(leagueListData?.indexOf(league))
                            } */
                            loading={!leagueListData}
                            disabled={false}
                          >
                            {league.participants.includes(userData.username)
                              ? "Ver "
                              : "Unirse"}
                          </LoadingButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                : null}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );

  // Add more state variables as needed
};

export default LeagueList;
