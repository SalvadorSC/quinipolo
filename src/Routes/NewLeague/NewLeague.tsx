import React, { useState, FormEvent } from "react";
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Switch,
  FormControlLabel,
  Snackbar,
  Alert,
} from "@mui/material";
import { apiPost } from "../../utils/apiUtils";
import { useFeedback } from "../../Context/FeedbackContext/FeedbackContext";
import { useUser } from "../../Context/UserContext/UserContext";
import { useNavigate } from "react-router-dom";

// Define the response type for the image upload
/* interface ImageUploadResponse {
  imageUrl: string;
} */

// Define the response type for league creation
interface LeagueCreationResponse {
  leagueId: string;
  leagueName: string;
  isPrivate: boolean;
  leagueImage?: string;
}

// Define the NewLeague component
const NewLeague: React.FC = () => {
  const [leagueName, setLeagueName] = useState<string>("");
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const { userData } = useUser();

  const { setFeedback } = useFeedback();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!leagueName) {
      setError("Por favor complete todos los campos requeridos.");
      return;
    }
    const leagueId = leagueName.toLowerCase().replace(/\s/g, "_");
    try {
      const newLeague = {
        leagueName,
        leagueId: leagueId,
        isPrivate,
        createdBy: userData.username,
        participants: [userData.username],
        moderatorArray: [userData.username],
      };
      const response = await apiPost<LeagueCreationResponse>(
        "/api/leagues",
        newLeague
      );

      setFeedback({
        message: "Liga creada exitosamente",
        severity: "success",
        open: true,
      });

      navigate("/league-dashboard?id=" + response.leagueId);
    } catch (error) {
      console.error("Error creating league:", error);
      setFeedback({
        message: "Error al crear la liga",
        severity: "error",
        open: true,
      });
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        width: "100%",
        p: window.innerWidth > 400 ? 4 : 2,
        borderRadius: "20px",
        maxWidth: 600,
        margin: "0 auto",
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Crear Nueva Liga
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Nombre de la Liga"
            value={leagueName}
            onChange={(e) => setLeagueName(e.target.value)}
            required
          />
        </Box>
        <Box mb={2}>
          <FormControlLabel
            control={
              <Switch
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                name="isPrivate"
                color="primary"
              />
            }
            label="Liga Privada"
          />
        </Box>
        {/*  <Box mb={2}>
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
          >
            {file ? "Cambiar Imagen" : "Subir Imagen"}
            <VisuallyHiddenInput
              onChange={handleFileChange}
              type="file"
              accept="image/*"
            />
          </Button>
        </Box> */}
        {/* {preview && (
          <Box mb={2}>
            <img src={preview} alt="Archivo seleccionado" width="100%" />
          </Box>
        )} */}
        <Button type="submit" variant="contained" color="primary">
          Crear Liga
        </Button>
      </form>
      {error && (
        <Snackbar
          open={Boolean(error)}
          autoHideDuration={6000}
          onClose={() => setError(null)}
        >
          <Alert onClose={() => setError(null)} severity="error">
            {error}
          </Alert>
        </Snackbar>
      )}
    </Paper>
  );
};

export default NewLeague;
