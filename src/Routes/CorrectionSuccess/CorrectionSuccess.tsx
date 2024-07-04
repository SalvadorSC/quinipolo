import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Button,
} from "@mui/material";
import style from "../QuinipoloSuccess/QuinipoloSuccess.module.scss";
import { useFeedback } from "../../Context/FeedbackContext/FeedbackContext";

type Result = {
  username: string;
  pointsEarned: number;
  totalPoints: number;
  correct15thGame: boolean;
};

const CorrectionSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setFeedback } = useFeedback();
  const results: Result[] = location.state?.results || [];
  const sortedResults = results.sort(
    (a: Result, b: Result) => b.totalPoints - a.totalPoints
  );

  // Group and sort points earned
  const groupAndSortPointsEarned = (results: Result[]) => {
    const pointsEarnedGrouping: { [key: number]: string[] } = {};
    results.forEach(({ username, pointsEarned }) => {
      if (!pointsEarnedGrouping[pointsEarned]) {
        pointsEarnedGrouping[pointsEarned] = [];
      }
      pointsEarnedGrouping[pointsEarned].push(username);
    });
    return Object.entries(pointsEarnedGrouping).sort(
      ([a], [b]) => Number(b) - Number(a)
    );
  };

  // Group and sort total points
  const groupAndSortTotalPoints = (results: Result[]) => {
    const totalPointsGrouping: { [key: number]: string[] } = {};
    results.forEach(({ username, totalPoints }) => {
      if (!totalPointsGrouping[totalPoints]) {
        totalPointsGrouping[totalPoints] = [];
      }
      totalPointsGrouping[totalPoints].push(username);
    });
    return Object.entries(totalPointsGrouping).sort(
      ([a]: [string, string[]], [b]: [string, string[]]) =>
        Number(b) - Number(a)
    );
  };

  const sorted_points_earned = groupAndSortPointsEarned(results);
  const sorted_total_points = groupAndSortTotalPoints(results);

  const generateMessageToShare = () => {
    let message = "*Resultados Quinipolo realizada:*\n\n";

    // Points Earned Distribution
    message += "*Puntos ganados en esta Quinipolo:*\n";
    for (const [points, usernames] of sorted_points_earned) {
      message += `- ${usernames.join(", ")}: *${points}p*\n`;
    }

    // Total Points Distribution (Leaderboard)
    message += "\n*Clasificación:*\n";
    let position = 1; // To keep track of the current position
    for (const [points, usernames] of sorted_total_points) {
      let prefix = `${position}.-`;
      if (position === 1) prefix = "🥇";
      else if (position === 2) prefix = "🥈";
      else if (position === 3) prefix = "🥉";

      message += `${prefix} ${usernames.join(", ")}: *${points}p*\n`;
      position += usernames.length; // Increment position by the number of tied users
    }

    // Determinar ganadores de la Quinipolo
    if (
      results.find(
        (result) => result.correct15thGame && result.pointsEarned === 15
      )
    ) {
      message += "\n *Ganadores de la Quinipolo*: \n";
      results.forEach((result, index) => {
        if (result.correct15thGame && result.pointsEarned === 15) {
          message += `- ${result.username}: ${result.totalPoints}p *(+${result.pointsEarned})* 🌟\n`;
        }
      });
    } else {
      message += "\n Sin ganador. 😢\n";
    }

    // Add additional information if necessary
    message +=
      "\nGracias por participar en la Quinipolo. ¡No te pierdas la próxima!";
    return message;
  };

  const messageToShare = generateMessageToShare();
  const copyMessageToClipboard = () => {
    navigator.clipboard
      .writeText(messageToShare)
      .then(() => {
        setFeedback({
          message: "Mensaje copiado al portapapeles!",
          severity: "success",
          open: true,
        });
      })
      .catch((err) => {
        setFeedback({
          message: "Error copiando el mensaje al portapapeles!",
          severity: "error",
          open: true,
        });
      });
  };
  return (
    <div className={style.correctionSuccessContainer}>
      <div>
        <Paper
          elevation={3}
          sx={{
            width: "100%",
            p: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-evenly",
            borderRadius: "10px 10px 0 0",
          }}
        >
          <h2>¡Quinipolo corregida con éxito!</h2>

          <p className={style.copyCorrection}>
            A continuación, se muestra la tabla con los resultados de los
            usuarios.
          </p>
        </Paper>
        <TableContainer
          sx={{
            borderRadius: "0 0 10px 10px ",
          }}
          component={Paper}
        >
          <Table
            sx={{
              maxHeight: "50vh",
            }}
            aria-label="simple table"
          >
            {/*  <TableHead>
            <TableRow>
              <TableCell>Usuario</TableCell>
              <TableCell align="right">Puntos Totales</TableCell>
            </TableRow>
          </TableHead> */}
            <TableBody>
              {sortedResults.map((row: Result, i) => {
                let position;
                if (
                  i === 0 ||
                  sortedResults[i].totalPoints === sortedResults[0].totalPoints
                ) {
                  position = "🥇";
                } else if (
                  i === 1 ||
                  sortedResults[i].totalPoints === sortedResults[1].totalPoints
                ) {
                  position = "🥈";
                } else if (
                  i === 2 ||
                  sortedResults[i].totalPoints === sortedResults[2].totalPoints
                ) {
                  position = "🥉";
                } else {
                  position =
                    sortedResults.findIndex(
                      (element) => element.totalPoints === row.totalPoints
                    ) + 1;
                }
                return (
                  <TableRow
                    key={`${row.username}-${row.totalPoints}`}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {position}. {row.username}
                    </TableCell>
                    <TableCell align="right" className={style.pointsCell}>
                      {row.totalPoints}{" "}
                      <span
                        className={
                          row.correct15thGame && row.pointsEarned === 15
                            ? style.correct15
                            : ""
                        }
                      >
                        (+{row.pointsEarned})
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <Paper
        elevation={3}
        sx={{
          width: "100%",
          p: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-evenly",
          marginTop: "20px",
        }}
      >
        <p className={style.reminder}>No olvides compartir los resultados!</p>
        <Button
          style={{ marginTop: 16 }}
          variant="contained"
          onClick={copyMessageToClipboard}
        >
          Copiar mensaje
        </Button>
        <Button
          variant="contained"
          onClick={copyMessageToClipboard}
          style={{ marginTop: 16 }}
        >
          <a
            href={`https://wa.me/?text=${encodeURIComponent(messageToShare)}`}
            target="_blank"
            style={{ color: "white", textDecoration: "none" }}
            rel="noopener noreferrer"
          >
            Compartir en WhatsApp
          </a>
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            navigate("/dashboard");
          }}
          className={style.returnButton}
          style={{ marginTop: 16 }}
        >
          Volver al menú principal
        </Button>
      </Paper>
      {/* Additional component content... */}
    </div>
  );
};

export default CorrectionSuccess;
