// SurveyForm.tsx
import React, { useState, FormEvent, useEffect } from "react";
import { Button, Tooltip } from "@mui/material";
import axios from "axios";
import { SurveyData } from "./SurveyForm.types";
import MatchForm from "../../Components/MatchForm/MatchForm";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import locale from "antd/es/date-picker/locale/es_ES";
import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/es";
import styles from "./SurveyForm.module.scss";
import { useNavigate } from "react-router-dom";
import { useFeedback } from "../../Context/FeedbackContext/FeedbackContext";
import { apiPost } from "../../utils/apiUtils";

type QuinipoloCreateResponseType = {
  _id: string;
  league: string;
  quinipolo: SurveyData[];
  endDate: Date;
  hasBeenCorrected: boolean;
  creationDate: Date;
};

const SurveyForm = () => {
  const navigate = useNavigate();
  const { setFeedback } = useFeedback();
  const [quinipolo, setQuinipolo] = useState<SurveyData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [teamOptions, setTeamOptions] = useState<{
    waterpolo: string[];
    football: string[];
  }>({ waterpolo: [], football: [] });
  const selectedTeams = quinipolo
    .map((match) => match.awayTeam)
    .concat(quinipolo.map((match) => match.homeTeam));

  const handleDateChange = (date: Dayjs | null, dateString: string) => {
    setSelectedDate(dayjs(dateString, "DD/MM/YYYY hh:mm").toDate());
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await apiPost<QuinipoloCreateResponseType>(
        `/api/quinipolos`,
        {
          league: "testLeague",
          quinipolo,
          endDate: selectedDate,
          hasBeenCorrected: false,
          creationDate: new Date(),
        }
      );
      setFeedback({
        message: "Quinipolo creada correctamente!",
        severity: "success",
        open: true,
      });
      navigate("/quinipolo-success", { state: { quinipolo: response } });
    } catch (error) {
      setFeedback({
        message:
          "Error creando la Quinipolo! Revisa todos los campos y prueba otra vez.",
        severity: "error",
        open: true,
      });
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
        <Tooltip title="Si no sabes como hacerlo, escribe al desarrollador. Cuando pueda escribirá una guía.">
          <HelpOutlineRoundedIcon />
        </Tooltip>
      </div>
      <p className={styles.dateTimeDisclaimer}>
        Escoge la fecha y hora cuando ya no se podrá responder la quinipolo
      </p>
      <div className={styles.datePickerContainer}>
        <DatePicker
          format="DD/MM/YYYY HH:mm"
          onChange={handleDateChange as any}
          locale={locale}
          placeholder="Fecha"
          className={styles.datePicker}
          showNow={false}
          popupClassName={styles.datePickerPopup}
          showTime={{ format: "HH:mm" }}
        />
      </div>

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
