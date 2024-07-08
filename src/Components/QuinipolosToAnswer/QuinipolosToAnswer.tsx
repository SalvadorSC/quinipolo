import { Button, CircularProgress, Tooltip } from "@mui/material";
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import Countdown from "react-countdown";
import { useNavigate } from "react-router-dom";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import EditIcon from "@mui/icons-material/Edit";
import styles from "./QuinipolosToAnswer.module.scss";
import { useUser } from "../../Context/UserContext/UserContext";
import { useFeedback } from "../../Context/FeedbackContext/FeedbackContext";
import { apiGet } from "../../utils/apiUtils";

const QuinipolosToAnswer = ({
  leagueId,
  wrapperLoading = false,
}: {
  leagueId?: string;
  wrapperLoading?: boolean;
}) => {
  const {
    userData: { moderatedLeagues, username, emailAddress, userId },
  } = useUser();
  const { setFeedback } = useFeedback();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [quinipolosToAnswer, setQuinipolosToAnswer] = useState<any[]>([]);
  const memoizedQuinipolosToAnswer = useMemo(() => {
    return () => {
      setLoading(true);
      if (userId && emailAddress && !loading) {
        apiGet(`/api/user/quinipolos?email=${emailAddress}`)
          .then((data: any) => {
            setQuinipolosToAnswer(data);
          })
          .catch((error) => {
            console.log(error);
            setFeedback({
              message: "Error cargando los datos del usuario",
              severity: "error",
              open: true,
            });
          });
      }
      setLoading(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setFeedback, username]);

  useEffect(() => {
    memoizedQuinipolosToAnswer();
  }, [memoizedQuinipolosToAnswer]);

  /* useEffect(() => {
    if (role === "moderator" && leagueId) {
      console.log(leagueId, moderatedLeagues);
    }
  }, [leagueId, quinipolosToAnswer, role]); */

  const isModeratorOfThisLeague =
    leagueId && moderatedLeagues.includes(leagueId);

  return (
    <div>
      <h2 className={styles.sectionTitle}>Quinipolos</h2>
      <hr />
      {loading || wrapperLoading ? (
        <CircularProgress />
      ) : quinipolosToAnswer.filter((quinipolo) => {
          return quinipolo.answered && !quinipolo.hasBeenCorrected;
        }).length > 0 ? (
        <p className={styles.noActionsMessage}>
          No tienes quinipolos pendientes
        </p>
      ) : (
        <>
          {quinipolosToAnswer.map((quinipolo) => {
            const deadline = new Date(quinipolo.endDate);
            const deadlineIsInPast = deadline.getTime() < new Date().getTime();
            // const deadlineIsInPast = new Date(quinipolo.endDate) > new Date();
            const day = String(deadline.getDate()).padStart(2, "0"); // Ensures the day is 2 characters long
            const month = String(deadline.getMonth() + 1).padStart(2, "0"); // Ensures the month is 2 characters long
            if (
              (leagueId && quinipolo.league !== leagueId) ||
              quinipolo.hasBeenCorrected
            )
              return null;
            return (
              <div
                className={styles.quinipoloContainer}
                key={`${quinipolo.league}-${quinipolo.endDate}`}
              >
                <div className={styles.quinipoloInfo}>
                  <h2>
                    {`${quinipolo.league} -  ${day}/${month}`}
                    {/* <span>
                    {!quinipolo.hasBeenCorrected && quinipolo.answered && (
                      <p style={{ color: "#CE4949" }}>
                        <EditOffIcon />
                      </p>
                    )}
                  </span> */}
                  </h2>
                  <p className={styles.countdown}>
                    {new Date(quinipolo.endDate) > new Date() && (
                      <Countdown date={quinipolo.endDate} />
                    )}
                  </p>
                </div>
                <div className={styles.quinipoloActions}>
                  {
                    <Button
                      className={styles.actionButton}
                      disabled={deadlineIsInPast || quinipolo.answered}
                      onClick={() => {
                        navigate(`/quinipolo?id=${quinipolo._id}`);
                      }}
                      variant={"contained"}
                    >
                      <span>Responder</span>
                      <PlayCircleFilledIcon />
                    </Button>
                  }
                  {moderatedLeagues.includes(quinipolo.league!) && (
                    <Tooltip
                      arrow
                      title={
                        !deadlineIsInPast &&
                        "Debe esperar a que finalice el plazo de la Quinipolo antes de poder realizar una corrección."
                      }
                    >
                      <Button
                        className={`${styles.actionButton} ${styles.actionButtonCorrect}`}
                        onClick={() => {
                          navigate(
                            `/quinipolo?id=${quinipolo._id}&correct=true`
                          );
                        }}
                        variant={"contained"}
                        disabled={!deadlineIsInPast}
                      >
                        <span>Corregir</span>
                        <EditIcon />
                      </Button>
                    </Tooltip>
                  )}
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default QuinipolosToAnswer;
