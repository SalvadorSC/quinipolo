import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Paper, Button } from "@mui/material";
import style from "../QuinipoloSuccess/QuinipoloSuccess.module.scss";
import { useFeedback } from "../../Context/FeedbackContext/FeedbackContext";
import Leaderboard from "../../Components/Leaderboard/Leaderboard";

export type Result = {
  username: string;
  pointsEarned?: number;
  totalPoints: number;
  correct15thGame: boolean;
  nQuinipolosParticipated: number;
  creationDate: string;
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
      if (!pointsEarnedGrouping[pointsEarned!]) {
        pointsEarnedGrouping[pointsEarned!] = [];
      }
      pointsEarnedGrouping[pointsEarned!].push(username);
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
    const locale = "es-ES";
    const dateOptions: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    };

    const formattedCreationDate = new Date(results[0]?.creationDate || new Date()).toLocaleDateString(locale, dateOptions);
    const formattedCorrectionDate = new Date().toLocaleDateString(locale, dateOptions);

    let message = `*Resultados Quinipolo realizada Jornada (${results[0]?.nQuinipolosParticipated})*\n`;
    message += `*Publicada:* ${formattedCreationDate}\n`;
    message += `*Corregida:* ${formattedCorrectionDate}\n\n`;

    // Points Earned Distribution
    message += "*Puntos ganados en esta Quinipolo:*\n";
    
    // Create a map of all participants with their points
    const allParticipants = new Map<string, number>();
    results.forEach(result => {
      if (result.pointsEarned !== undefined) {
        allParticipants.set(result.username, result.pointsEarned);
      }
    });

    // Sort participants by points earned
    const sortedParticipants = new Map([...allParticipants.entries()].sort((a, b) => b[1] - a[1]));

    // Group participants by points
    const pointsGroups = new Map<number, string[]>();
    sortedParticipants.forEach((points, username) => {
      if (!pointsGroups.has(points)) {
        pointsGroups.set(points, []);
      }
      pointsGroups.get(points)?.push(username);
    });

    // Add points distribution to message
    for (const [points, usernames] of pointsGroups) {
      message += `- ${usernames.join(", ")}: *${points}p*\n`;
    }

    // Total Points Distribution (Leaderboard)
    message += "\n*Clasificación:*\n";
    let position = 1;
    for (const [points, usernames] of sorted_total_points) {
      let prefix = `${position}.-`;
      if (position === 1) prefix = "🥇";
      else if (position === 2) prefix = "🥈";
      else if (position === 3) prefix = "🥉";

      message += `${prefix} ${usernames.join(", ")}: *${points}p*\n`;
      position += usernames.length;
    }

    // Determine Quinipolo winners
    if (results.find(result => result.correct15thGame && result.pointsEarned === 15)) {
      message += "\n*Ganadores de la Quinipolo*: \n";
      results.forEach(result => {
        if (result.correct15thGame && result.pointsEarned === 15) {
          message += `- ${result.username}: ${result.totalPoints}p *(+${result.pointsEarned})* 🌟\n`;
        }
      });
    } else {
      message += "\nSin ganador. 😢\n";
    }

    message += "\nGracias por participar en la Quinipolo. ¡No te pierdas la próxima!";
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
            borderRadius: results.length > 0 ? "10px 10px 0 0" : null,
          }}
        >
          <h2>¡Quinipolo corregida con éxito!</h2>

          <p
            className={style.copyCorrection}
            style={results.length > 0 ? {} : { marginTop: 40 }}
          >
            {results.length > 0
              ? "A continuación, se muestra la tabla con los resultados de los usuarios."
              : "Aunque... Vaya! Parece que nadie ha respondido esta Quinipolo! "}
          </p>
          {results.length > 0 ? null : (
            <p className={style.copyCorrection}>
              Asegúrate de comunicar bien como se hace!
            </p>
          )}
        </Paper>
        {results.length > 0 ? (
          <Leaderboard sortedResults={sortedResults} />
        ) : null}
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
