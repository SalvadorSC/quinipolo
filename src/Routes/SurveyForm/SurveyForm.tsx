// SurveyForm.tsx
import React, { useState, FormEvent, useEffect } from "react";
import { Button } from "@mui/material";
import axios from "axios";
import styles from "./SurveyForm.module.scss";
import { SurveyData } from "./SurveyForm.types";
import MatchForm from "../../Components/MatchForm/MatchForm";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";

const SurveyForm: React.FC = () => {
  const [quinipolo, setQuinipolo] = useState<SurveyData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [teamOptions, setTeamOptions] = useState<{
    waterpolo: string[];
    football: string[];
  }>({ waterpolo: [], football: [] });
  const selectedTeams = quinipolo
    .map((match) => match.awayTeam)
    .concat(quinipolo.map((match) => match.homeTeam));

  /* const getQuinipolos = async () => {
    fetch("http://localhost:3000/api/quinipolos/testLeague")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  }; */

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log({
      league: "testLeague",
      quinipolo,
    });
    // Handle survey submission logic here
    try {
      const response = await axios.post(
        "https://quinipolo.onrender.com/api/quinipolos",
        {
          league: "testLeague",
          quinipolo,
        }
      );
      console.log("Quinipolo created successfully:", response.data);
    } catch (error) {
      console.error("Error creating Quinipolo:", error);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:3000/api/teamOptions")
      .then((res) => res.json())
      .then((data) => {
        setTeamOptions(data[0]);
        setLoading(false);
      });
  }, []);

  const matchArray = new Array(15).fill(null);

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div
        style={{
          color: "white",
          display: "flex",
          alignItems: "center",
          marginTop: 60,
          marginBottom: 30,
          justifyContent: "space-between",
          padding: 26,
        }}
      >
        <h1>Formulari creació Quinipolo</h1>
        <HelpOutlineRoundedIcon />
      </div>

      {matchArray.map((_, index) => (
        <MatchForm
          teamOptions={teamOptions}
          selectedTeams={selectedTeams}
          index={index}
          setQuinipolo={setQuinipolo}
          loading={loading}
        />
      ))}
      {/* <VerticalLinearStepper
        teamOptions={teamOptions}
        selectedTeams={selectedTeams}
        matchArray={matchArray}
        setQuinipolo={setQuinipolo}
        quinipolo={quinipolo}
      /> */}

      <div className={styles.submitButton}>
        <Button type="submit" variant="contained" color="primary">
          Submit Survey
        </Button>
      </div>
    </form>
  );
};

export default SurveyForm;
