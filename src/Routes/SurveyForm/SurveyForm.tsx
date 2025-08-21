// SurveyForm.tsx
// TODO: Make date picker responsive to theme changes by adding theme-specific styles and configuration
import React, { useState, FormEvent, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
} from "@mui/material";
import { SurveyData } from "../../types/quinipolo";
import MatchForm from "../../Components/MatchForm/MatchForm";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import locale from "antd/es/date-picker/locale/es_ES";
import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/es";
import styles from "./SurveyForm.module.scss";
import { useNavigate } from "react-router-dom";
import { useFeedback } from "../../Context/FeedbackContext/FeedbackContext";
import { useTranslation } from "react-i18next";
import { apiPost } from "../../utils/apiUtils";

import { QuinipoloCreateResponseType } from "../../types/quinipolo";

const SurveyForm = () => {
  const navigate = useNavigate();
  const { setFeedback } = useFeedback();
  const [quinipolo, setQuinipolo] = useState<SurveyData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [teamOptions, setTeamOptions] = useState<{
    waterpolo: string[];
    football: string[];
  }>({ waterpolo: [], football: [] });
  const [helpModalOpen, setHelpModalOpen] = useState<boolean>(false);
  const selectedTeams = quinipolo
    .map((match) => match.awayTeam)
    .concat(quinipolo.map((match) => match.homeTeam));
  const { t } = useTranslation();

  const handleDateChange = (date: Dayjs | null, dateString: string) => {
    setSelectedDate(dayjs(dateString, "DD/MM/YYYY hh:mm").toDate());
  };

  const handleHelpClick = () => {
    setHelpModalOpen(true);
  };

  const handleCloseHelpModal = () => {
    setHelpModalOpen(false);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const queryParams = new URLSearchParams(window.location.search);
    const leagueId = queryParams.get("leagueId");

    try {
      if (selectedDate === null || selectedDate < new Date()) {
        setFeedback({
          message: t("selectDateTimeForQuinipolo"),
          severity: "error",
          open: true,
        });
        window.scrollTo(0, 0);
        return;
      }

      // Set loading state to prevent multiple submissions
      setLoading(true);

      // Create quinipolo via backend API
      const response = await apiPost<QuinipoloCreateResponseType>(
        `/api/quinipolos`,
        {
          leagueId: leagueId,
          quinipolo,
          endDate: selectedDate,
          hasBeenCorrected: false,
          creationDate: new Date(),
        }
      );

      setFeedback({
        message: t("quinipoloCreatedSuccess"),
        severity: "success",
        open: true,
      });

      navigate("/quinipolo-success", { state: { quinipolo: response } });
    } catch (error) {
      setFeedback({
        message: t("errorCreatingQuinipolo"),
        severity: "error",
        open: true,
      });
      console.error("Error creating Quinipolo:", error);
    } finally {
      // Always reset loading state, even if there's an error
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);

    const fetchTeams = async () => {
      try {
        // Use only the backend API since Supabase teams calls are failing
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/teams/all`
        );
        if (!response.ok) {
          throw new Error(`Backend API failed: ${response.status}`);
        }
        const backendTeams = await response.json();
        setTeamOptions(backendTeams);
      } catch (error) {
        console.error("Error fetching teams:", error);
        setFeedback({
          message: "Error loading teams",
          severity: "error",
          open: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [setFeedback]);

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
        <h2>{t("createQuinipolo")}</h2>
        <HelpOutlineRoundedIcon
          onClick={handleHelpClick}
          style={{ cursor: "pointer" }}
        />
      </div>
      <p className={styles.dateTimeDisclaimer}>{t("dateTimeDisclaimer")}</p>
      <div className={styles.datePickerContainer}>
        <DatePicker
          format="DD/MM/YYYY HH:mm"
          onChange={handleDateChange as any}
          locale={locale}
          placeholder={t("date")}
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
        <Button
          type="submit"
          disabled={loading}
          variant="contained"
          color="primary"
        >
          {loading ? t("creatingQuinipolo") : t("createQuinipolo")}
        </Button>
      </div>

      {/* Help Modal */}
      <Dialog
        open={helpModalOpen}
        onClose={handleCloseHelpModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{t("howQuinipoloWorksTitle")}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography
              variant="body1"
              component="div"
              sx={{
                whiteSpace: "pre-line",
                lineHeight: 1.6,
              }}
            >
              {t("howQuinipoloWorksContent")}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseHelpModal} color="primary">
            {t("close")}
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  );
};

export default SurveyForm;
