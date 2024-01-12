import React from "react";
import { Button, Paper } from "@mui/material";
import style from "./QuinipoloSuccess.module.scss";
import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import queryString from "query-string";

const QuinipoloSuccess = () => {
  const navigate = useNavigate();

  // Function to construct the deep link
  const getDeepLink = () => {
    const quinipoloId = "123"; // Replace with the actual Quinipolo ID
    const queryParams = { quinipoloId }; // Add more parameters as needed
    const deepLink = `https://quinipolo.com/quinipolo?${queryString.stringify(
      queryParams
    )}`;
    return deepLink;
  };
  const messageToShare = `¡Hola! Te invito a participar en la Quinipolo de esta semana. Ingresa tus predicciones para los partidos y compite con otros participantes. ¡Buena suerte! 🏆 ${getDeepLink()}`;

  const copyMessageToClipboard = () => {
    navigator.clipboard
      .writeText(messageToShare)
      .then(() => {
        console.log("Message copied to clipboard");
      })
      .catch((err) => {
        console.error("Error copying message to clipboard:", err);
      });
  };

  return (
    <div className={style.quinipoloSuccessContainer}>
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          p: 4,
          height: "80%",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "space-evenly",
        }}
      >
        <h1>Quinipolo creada con éxito</h1>

        <p>
          Para compartir tu Quinipolo con tus amigos, copia el siguiente mensaje
          y envíaselo por WhatsApp:
        </p>
        {/* Mensaje de compartir */}
        <QRCode
          className={style.qrCode}
          value={`https://wa.me/?text=${encodeURIComponent(messageToShare)}`}
        />
        <Button
          variant="contained"
          onClick={copyMessageToClipboard}
          className={style.submitButton}
          type="submit"
        >
          Copiar mensaje
        </Button>
        <Button
          variant="contained"
          onClick={copyMessageToClipboard}
          className={style.submitButton}
          style={{ marginTop: 16 }}
          type="submit"
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
          variant="contained"
          onClick={() => {
            navigate("/dashboard");
          }}
          className={style.submitButton}
          style={{ marginTop: 16 }}
          type="submit"
        >
          Volver al menú principal
        </Button>
      </Paper>
    </div>
  );
};

export default QuinipoloSuccess;
