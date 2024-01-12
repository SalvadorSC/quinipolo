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
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import axios from "axios";
import style from "./AnswersForm.module.scss";
import { useNavigate } from "react-router-dom";
import Loader from "../../Components/Loader/Loader";

const AnswersForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [quinipolo, setQuinipolo] = useState<{
    league: string;
    _id: string;
    quinipolo: SurveyData[];
  }>({ league: "", _id: "", quinipolo: [] });
  const [name, setName] = useState<string>("");
  const [respostes, setRespostes] = useState<
    {
      matchNumber: number;
      chosenWinner: string;
      isGame15: boolean;
      goalsHomeTeam: string;
      goalsAwayTeam: string;
    }[]
  >(
    new Array(14)
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
      })
  );

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/quinipolos/testLeague`
      );
      setLoading(false);
      console.log(response.data);
      setQuinipolo(response.data[0]);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle the error as needed
    }
  };

  useEffect(() => {
    setLoading(true);
    if (localStorage.getItem("authenticated") !== "true") {
      navigate("/sign-in");
    } else {
      fetchData();
    }
  }, [navigate]);

  const submitQuinipolo = async () => {
    const data = { name, respostes, quinipolo };
    console.log(data);
    /* try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/quinipolos/answers`,
        {
          league: "testLeague",
          
        }
      );
      console.log("Quinipolo submitted successfully:", response.data);
    } catch (error) {
      console.error("Error submitting Quinipolo:", error);
    } */
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
          <TableContainer sx={{ mt: 16 }} component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{ marginBottom: 16 }}>
                    Respostes Quinipolo {quinipolo.league}
                  </TableCell>
                </TableRow>
              </TableHead>
              {/* Nom de la persona */}
              <TextField
                onChange={(e) => setName(e.target.value)}
                id="outlined-basic"
                label="Nombre"
                variant="outlined"
                className={style.nameInput}
              />
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
