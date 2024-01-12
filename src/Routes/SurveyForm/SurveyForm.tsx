// SurveyForm.tsx
import React, { useState, FormEvent, useEffect } from "react";
import { Button, Tooltip } from "@mui/material";
import axios from "axios";
import styles from "./SurveyForm.module.scss";
import { SurveyData } from "./SurveyForm.types";
import MatchForm from "../../Components/MatchForm/MatchForm";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
/* import { DatePicker } from "antd"; */
import { Dayjs } from "dayjs";

const SurveyForm: React.FC = () => {
  const [quinipolo, setQuinipolo] = useState<SurveyData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedTime, setSelectedTime] = useState<Date | null>(new Date());
  const [teamOptions, setTeamOptions] = useState<{
    waterpolo: string[];
    football: string[];
  }>({ waterpolo: [], football: [] });
  const selectedTeams = quinipolo
    .map((match) => match.awayTeam)
    .concat(quinipolo.map((match) => match.homeTeam));

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };
  const handleTimeChange = (time: Date | null) => {
    setSelectedTime(time);
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Handle survey submission logic here
    try {
      const response = await axios.post(
        `process.env.REACT_APP_API_BASE_URL/api/quinipolos`,
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
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/teamOptions`)
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
        <h1>Formulario creación Quinipolo</h1>
        <Tooltip title="Si no sabes como hacerlo, escribe al desarrollador. Cuando pueda escribira una guia.">
          <HelpOutlineRoundedIcon />
        </Tooltip>
      </div>
      {/* <DatePicker
        format="DD/MM/YYYY hh:mm A"
        onChange={(date: Dayjs | null, dateString: string) =>
          console.log(date, dateString)
        }
        //showTime={{ use12Hours: true }}
      /> */}
      {matchArray.map((_, index) => (
        <MatchForm
          key={index}
          teamOptions={teamOptions}
          selectedTeams={selectedTeams}
          index={index}
          setQuinipolo={setQuinipolo}
          loading={loading}
        />
      ))}

      <div className={styles.submitButton}>
        <Button type="submit" variant="contained" color="primary">
          Crear Quinipolo
        </Button>
      </div>
    </form>
  );
};

export default SurveyForm;
