import React from "react";
import { Button, Paper } from "@mui/material";
import style from "./QuinipoloSuccess.module.scss";
import { useLocation, useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import dayjs from "dayjs";
import { useFeedback } from "../../Context/FeedbackContext/FeedbackContext";

const QuinipoloSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setFeedback } = useFeedback();
  const deepLink = `https://quinipolo.com/quinipolo?${location.state.quinipolo._id}`;
  // Function to construct the deep link

  const messageToShare = `¡Hola! Te invito a participar en la Quinipolo de esta semana. Ingresa tus predicciones para los partidos y compite con otros participantes. ¡Buena suerte! 🏆 ${deepLink}`;

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
    <div className={style.quinipoloSuccessContainer}>
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          p: 4,
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "space-evenly",
        }}
      >
        <h2>¡Quinipolo creada con éxito!</h2>
        <p>La fecha limite para responder esta Quinipolo es:</p>
        <p>
          {dayjs(location.state.quinipolo.endDate).format("DD-MM-YYYY HH:mm")}h
        </p>
        <br />
        <p>
          Para compartir tu Quinipolo con tus amigos, usa alguno de los
          siguientes métodos:
        </p>
        {/* Mensaje de compartir */}
        <QRCode className={style.qrCode} value={deepLink} />
        <Button variant="contained" onClick={copyMessageToClipboard}>
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
    </div>
  );
};

export default QuinipoloSuccess;
