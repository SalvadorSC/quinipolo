import React, { useEffect, useState } from "react";
import { SurveyData } from "../SurveyForm/SurveyForm.types";
import {
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

const AnswersForm = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [quinipolo, setQuinipolo] = useState<SurveyData[]>([]);
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

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:3000/api/quinipolos/testLeague")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setLoading(false);
        setQuinipolo(data[0].quinipolo);
      });
  }, []);

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
      console.log(team);
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

  return (
    <div>
      {loading ? <div>Loading...</div> : null}
      <TableContainer sx={{ mt: 16 }} component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Respostes Quinipolo </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {quinipolo.map((match, index) => (
              <TableRow
                key={`${match.homeTeam}${match.awayTeam}__${index}`}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="center" component="th" scope="row">
                  <ToggleButtonGroup
                    color="primary"
                    value={respostes[index].chosenWinner}
                    exclusive
                    onChange={handleChange}
                    aria-label="Match winner"
                  >
                    <ToggleButton value={`${match.homeTeam}__${index}`}>
                      {match.homeTeam}
                    </ToggleButton>
                    <ToggleButton value={`empat__${index}`}>Empat</ToggleButton>
                    <ToggleButton value={`${match.awayTeam}__${index}`}>
                      {match.awayTeam}
                    </ToggleButton>
                  </ToggleButtonGroup>
                  {index === 14 && (
                    <>
                      <div>
                        <p>Gols equip local:</p>

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
                            {match.gameType === "waterpolo" ? "9/10" : "1/2"}
                          </ToggleButton>
                          <ToggleButton value={"+__home"}>+</ToggleButton>
                        </ToggleButtonGroup>
                      </div>
                      <div>
                        <p>Gols equip visitant:</p>
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
                            {match.gameType === "waterpolo" ? "9/10" : "1/2"}
                          </ToggleButton>
                          <ToggleButton value={"+__away"}>+</ToggleButton>
                        </ToggleButtonGroup>
                      </div>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AnswersForm;
