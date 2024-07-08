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
import Loader from "../../components/Loader/Loader";
import { useFeedback } from "../../Context/FeedbackContext/FeedbackContext";
import { apiGet, apiPost } from "../../utils/apiUtils";

type RespostesType = {
  matchNumber: number;
  chosenWinner: string;
  isGame15: boolean;
  goalsHomeTeam: string;
  goalsAwayTeam: string;
};

type QuinipoloType = {
  league: string;
  _id: string;
  quinipolo: SurveyData[];
};

type CorrectionResponseType = {
  message: string;
  results: {
    correctAnswers: string[];
    userAnswers: string[];
    points: number;
  };
};

type AnswerResponseType = {
  message: string;
};

const AnswersForm = () => {
  const navigate = useNavigate();
  const { setFeedback } = useFeedback();
  const [loading, setLoading] = useState<boolean>(false);
  const [quinipolo, setQuinipolo] = useState<QuinipoloType>({
    league: "",
    _id: "",
    quinipolo: [],
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
  const correctingModeOn = queryParams.get("correct");

  const fetchData = async () => {
    try {
      const queryParams = new URLSearchParams(window.location.search);
      const id = queryParams.get("id");

      if (!id) {
        console.error("ID is missing in the query string");
        return;
      }

      const response = await apiGet<QuinipoloType>(`/api/quinipolo?id=${id}`);
      setLoading(false);
      setQuinipolo(response);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle the error as needed
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [navigate]);

  const submitQuinipolo = async () => {
    const answerToSubmit = {
      userId: localStorage.getItem("userId"), // Assuming you store userId in localStorage
      quinipoloId: quinipolo._id,
      answers: respostes.map((resposta, index) => ({
        matchNumber: index + 1,
        chosenWinner: resposta.chosenWinner,
        goalsHomeTeam: resposta.goalsHomeTeam,
        goalsAwayTeam: resposta.goalsAwayTeam,
      })),
    };
    if (correctingModeOn) {
      console.log("correcting mode on");
      const response = await apiPost<CorrectionResponseType>(
        `/api/quinipolo/${quinipolo._id}/corrections`,
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
          `/api/quinipolo/answers`,
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
  if (loading) {
    return <Loader />;
  } else {
    return (
      <div>
        <FormControl>
          <TableContainer sx={{ mt: 16, mb: 8 }} component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{ marginBottom: 16 }}>
                    {correctingModeOn
                      ? "Corrección"
                      : `Respostes Quinipolo ${quinipolo.league}`}
                  </TableCell>
                </TableRow>
              </TableHead>

              {/* Partits */}
              <TableBody>
                {quinipolo.quinipolo.map((match, index) => (
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
                          className={style.teamAnswerButton}
                          value={`${match.homeTeam}__${index}`}
                        >
                          {match.homeTeam}
                        </ToggleButton>
                        <ToggleButton value={`empat__${index}`}>
                          Empat
                        </ToggleButton>
                        <ToggleButton
                          className={style.teamAnswerButton}
                          value={`${match.awayTeam}__${index}`}
                        >
                          {match.awayTeam}
                        </ToggleButton>
                      </ToggleButtonGroup>
                      {index === 14 && (
                        <div className={style.goalsContainer}>
                          <div>
                            <p>Gols {quinipolo.quinipolo[14].homeTeam}:</p>

                            <ToggleButtonGroup
                              color="primary"
                              value={respostes[index].goalsHomeTeam}
                              exclusive
                              onChange={handleGame15Change}
                              aria-label="Match winner"
                            >
                              <ToggleButton value={"-__home"}>-</ToggleButton>
                              <ToggleButton
                                value={
                                  match.gameType === "waterpolo"
                                    ? "9/10__home"
                                    : "1/2__home"
                                }
                              >
                                {match.gameType === "waterpolo"
                                  ? "9/10"
                                  : "1/2"}
                              </ToggleButton>
                              <ToggleButton value={"+__home"}>+</ToggleButton>
                            </ToggleButtonGroup>
                          </div>
                          <div>
                            <p>Gols {quinipolo.quinipolo[14].awayTeam}:</p>
                            <ToggleButtonGroup
                              color="primary"
                              value={respostes[index].goalsAwayTeam}
                              exclusive
                              onChange={handleGame15Change}
                              aria-label="Match winner"
                            >
                              <ToggleButton value={"-__away"}>-</ToggleButton>
                              <ToggleButton
                                value={
                                  match.gameType === "waterpolo"
                                    ? "9/10__away"
                                    : "1/2__away"
                                }
                              >
                                {match.gameType === "waterpolo"
                                  ? "9/10"
                                  : "1/2"}
                              </ToggleButton>
                              <ToggleButton value={"+__away"}>+</ToggleButton>
                            </ToggleButtonGroup>
                          </div>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              {/* Submit button */}
              <Button
                variant="contained"
                onClick={submitQuinipolo}
                className={style.submitButton}
                type="submit"
              >
                Enviar
              </Button>
            </Table>
          </TableContainer>
        </FormControl>
      </div>
    );
  }
};

export default AnswersForm;
