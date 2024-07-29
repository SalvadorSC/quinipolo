import React, { useEffect, useState } from "react";
import { SurveyData } from "../SurveyForm/SurveyForm.types";
import {
  Button,
  FormControl,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import axios from "axios";
import style from "./AnswersForm.module.scss";
import { useNavigate } from "react-router-dom";
import Loader from "../../Components/Loader/Loader";
import { useFeedback } from "../../Context/FeedbackContext/FeedbackContext";
import { apiGet, apiPost } from "../../utils/apiUtils";
import { useUser } from "../../Context/UserContext/UserContext";
import GoalsToggleButtonGroup from "./GoalsToggleButtonGroup";

type RespostesType = {
  matchNumber: number;
  chosenWinner: string;
  isGame15: boolean;
  goalsHomeTeam: string;
  goalsAwayTeam: string;
};

type QuinipoloType = {
  leagueName: string;
  leagueId: string;
  _id: string;
  quinipolo: SurveyData[];
  participantsWhoAnswered: string[];
  correctAnswers: RespostesType[];
  creationDate?: string;
  hasBeenCorrected: boolean;
  endDate?: string;
};

type CorrectionResponseType = {
  message: string;
  results: {
    correctAnswers: { chosenWinner: string; matchNumber: number }[];
    userAnswers: string[];
    points: number;
  };
};

type AnswerResponseType = {
  message: string;
};

const AnswersForm = () => {
  const user = useUser();
  const navigate = useNavigate();
  const { setFeedback } = useFeedback();
  const [loading, setLoading] = useState<boolean>(false);
  const [quinipolo, setQuinipolo] = useState<QuinipoloType>({
    leagueName: "",
    leagueId: "",
    _id: "",
    quinipolo: [],
    participantsWhoAnswered: [],
    hasBeenCorrected: false,
    correctAnswers: [],
  });

  const initialRespostes: RespostesType[] = new Array(14)
    .fill({
      matchNumber: undefined,
      chosenWinner: "",
      isGame15: false,
    })
    .concat({
      matchNumber: 15,
      chosenWinner: "",
      isGame15: true,
      goalsHomeTeam: "",
      goalsAwayTeam: "",
    });

  const [respostes, setRespostes] = useState<RespostesType[]>(initialRespostes);

  // get via params if correcting or not
  const queryParams = new URLSearchParams(window.location.search);
  const correctingModeOn = queryParams.get("correct"); // another submit
  const editCorrectionModeOn = queryParams.get("correctionEdit"); // show corrections selected
  const seeUserAnswersModeOn = queryParams.get("see"); // if user answered, show answers. If correction done, show corrections. If both, show corrected Answers

  const fetchData = async () => {
    try {
      const queryParams = new URLSearchParams(window.location.search);
      const id = queryParams.get("id");
      let response: any;
      if (!id) {
        console.error("ID is missing in the query string");
        return;
      }
      if (editCorrectionModeOn) {
        // will show a quinipolo, the corrections selected and give option to edit them.
        response = await apiGet<QuinipoloType>(
          `/api/quinipolos/quinipolo/${id}/correction-see`
        );
        setRespostes(response.correctAnswers);
      } else if (seeUserAnswersModeOn) {
        // will show a quinipolo with the user's answers
        response = await apiGet<{
          quinipolo: QuinipoloType;
          answers: RespostesType[];
        }>(
          `/api/quinipolos/quinipolo/${id}/answers-see/${user.userData.username}`
        );
        if (response.answers.length === 0) {
          setFeedback({
            message: "No tens cap resposta per aquest Quinipolò",
            severity: "error",
            open: true,
          });
          return;
        }
        setQuinipolo(response.quinipolo);
        setLoading(false);
        if (response!.answers.answers.length > 0) {
          setRespostes(response!.answers.answers);
        }
        return;
      } else {
        response = await apiGet<QuinipoloType>(
          `/api/quinipolos/quinipolo/${id}`
        );
      }
      setLoading(false);
      setQuinipolo(response);
    } catch (error: any) {
      console.error("Error fetching data:", error);
      // Handle the error as needed
      setFeedback({
        message: error.message,
        severity: "error",
        open: true,
      });
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitQuinipolo = async () => {
    const answerToSubmit = {
      username: localStorage.getItem("username") ?? user.userData.username,
      quinipoloId: quinipolo._id,
      answers: respostes.map((resposta, index) => ({
        matchNumber: index + 1,
        chosenWinner: resposta.chosenWinner,
        goalsHomeTeam: resposta.goalsHomeTeam,
        goalsAwayTeam: resposta.goalsAwayTeam,
      })),
    };
    if (
      correctingModeOn &&
      user.userData.moderatedLeagues.includes(quinipolo.leagueId)
    ) {
      console.log("Correcting mode on");
      const response = await apiPost<CorrectionResponseType>(
        `/api/quinipolos/quinipolo/${quinipolo._id}/submit-correction`,
        answerToSubmit
      );
      navigate("/correction-success", {
        state: { results: response.results },
      });
      setFeedback({
        message: response.message,
        severity: "success",
        open: true,
      });
    } else if (
      editCorrectionModeOn &&
      user.userData.moderatedLeagues.includes(quinipolo.leagueId)
    ) {
      console.log("Editing correction mode on");
      const response = await apiPost<CorrectionResponseType>(
        `/api/quinipolos/quinipolo/${quinipolo._id}/submit-correction-edit`,
        answerToSubmit
      );
      navigate("/correction-success", {
        state: { results: response.results },
      });
      setFeedback({
        message: response.message,
        severity: "success",
        open: true,
      });
    } else {
      try {
        const response = await apiPost<AnswerResponseType>(
          `/api/quinipolos/quinipolo/answers`,
          answerToSubmit
        );
        setFeedback({
          message: response.message,
          severity: "success",
          open: true,
        });
        navigate("/dashboard");
      } catch (error: unknown) {
        console.error("Error submitting Quinipolo:", error);

        // Check if error is of type AxiosError
        if (axios.isAxiosError(error)) {
          // Now TypeScript knows this is an AxiosError, you can access error.response etc.
          if (error.response && error.response.status === 409) {
            console.log(error.response);
            setFeedback({
              message: error.response.data,
              severity: "error",
              open: true,
            });
          }
        } else {
          // Handle non-Axios errors
          setFeedback({
            message: "An unexpected error occurred",
            severity: "error",
            open: true,
          });
        }
      }
    }
  };

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newValue: string
  ) => {
    if (newValue === null || seeUserAnswersModeOn) return;
    setRespostes((prevrespostes) => {
      const index = parseInt(newValue.split("__")[1]);
      const updatedData = [...prevrespostes];
      updatedData[index] = {
        ...updatedData[index],
        chosenWinner: newValue,
      };
      return updatedData;
    });
  };

  const handleGame15Change = (
    event: React.MouseEvent<HTMLElement>,
    newValue: string
  ) => {
    if (newValue === null || seeUserAnswersModeOn) return;
    setRespostes((prevrespostes) => {
      const team = newValue.split("__")[1];
      const updatedData = [...prevrespostes];
      if (team === "home") {
        updatedData[14] = {
          ...updatedData[14],
          goalsHomeTeam: newValue,
        };
      } else {
        updatedData[14] = {
          ...updatedData[14],
          goalsAwayTeam: newValue,
        };
      }
      return updatedData;
    });
  };

  const matchOption = (value: string, index: number) => {
    if (!quinipolo.hasBeenCorrected) {
      return <span>{value}</span>;
    }
    const answerIsCorrect = (answer: string) => {
      return quinipolo.correctAnswers[index].chosenWinner === answer;
    };
    return (
      <span
        className={`${
          seeUserAnswersModeOn &&
          (answerIsCorrect(`${value}__${index}`)
            ? style.correctAnswer
            : respostes[index].chosenWinner === `${value}__${index}` &&
              style.answerIsWrong)
        }`}
      >
        {value}
      </span>
    );
  };

  if (quinipolo.quinipolo === undefined) {
    return <div>Loading...</div>;
  }
  if (loading) {
    return <Loader />;
  } else {
    return (
      <FormControl>
        <TableContainer sx={{ mb: 8 }} component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ marginBottom: 16 }}>
                  {correctingModeOn
                    ? "Corrección"
                    : `Respostes Quinipolo ${quinipolo.leagueName}`}
                </TableCell>
              </TableRow>
            </TableHead>

            {/* Partits */}
            <TableBody>
              {quinipolo.quinipolo.map((match, index) => {
                return (
                  <TableRow
                    key={`${match.homeTeam}${match.awayTeam}__${index}`}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="center" component="th" scope="row">
                      <p className={style.matchName}>Partido {index + 1}</p>
                      <ToggleButtonGroup
                        color="primary"
                        className={style.teamAnswerButtonContainer}
                        value={respostes[index].chosenWinner}
                        exclusive
                        onChange={handleChange}
                        aria-label="Match winner"
                      >
                        <ToggleButton
                          className={`${style.teamAnswerButton}`}
                          value={`${match.homeTeam}__${index}`}
                        >
                          {matchOption(match.homeTeam, index)}
                        </ToggleButton>
                        <ToggleButton value={`empat__${index}`}>
                          {matchOption("empat", index)}
                        </ToggleButton>
                        <ToggleButton
                          className={`${style.teamAnswerButton}`}
                          value={`${match.awayTeam}__${index}`}
                        >
                          {matchOption(match.awayTeam, index)}
                        </ToggleButton>
                      </ToggleButtonGroup>
                      {index === 14 && (
                        <div className={style.goalsContainer}>
                          <GoalsToggleButtonGroup
                            teamType="home"
                            teamName={quinipolo.quinipolo[14].homeTeam}
                            goals={respostes[index].goalsHomeTeam}
                            correctGoals={
                              quinipolo.correctAnswers.length > 0
                                ? quinipolo.correctAnswers[index].goalsHomeTeam
                                : ""
                            }
                            matchType={match.gameType}
                            onChange={handleGame15Change}
                            seeUserAnswersModeOn={seeUserAnswersModeOn}
                            quinipoloHasBeenCorrected={
                              quinipolo.hasBeenCorrected
                            }
                          />
                          <GoalsToggleButtonGroup
                            teamType="away"
                            teamName={quinipolo.quinipolo[14].awayTeam}
                            goals={respostes[index].goalsAwayTeam}
                            correctGoals={
                              quinipolo.correctAnswers.length > 0
                                ? quinipolo.correctAnswers[index].goalsAwayTeam
                                : ""
                            }
                            matchType={match.gameType}
                            onChange={handleGame15Change}
                            seeUserAnswersModeOn={seeUserAnswersModeOn}
                            quinipoloHasBeenCorrected={
                              quinipolo.hasBeenCorrected
                            }
                          />
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            {/* Submit button */}
            {seeUserAnswersModeOn ? null : (
              <Button
                variant="contained"
                onClick={submitQuinipolo}
                className={style.submitButton}
                type="submit"
              >
                {editCorrectionModeOn &&
                user.userData.moderatedLeagues.includes(quinipolo.leagueId)
                  ? "Editar corrección"
                  : "Enviar"}
              </Button>
            )}
          </Table>
        </TableContainer>
      </FormControl>
    );
  }
};

export default AnswersForm;
