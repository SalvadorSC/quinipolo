import React, { useState, ChangeEvent, FormEvent } from "react";
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Switch,
  FormControlLabel,
  styled,
  Snackbar,
  Alert,
} from "@mui/material";
import { apiPost } from "../../utils/apiUtils";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useFeedback } from "../../Context/FeedbackContext/FeedbackContext";

// Define the response type for the image upload
interface ImageUploadResponse {
  imageUrl: string;
}

// Define the response type for league creation
interface LeagueCreationResponse {
  leagueId: string;
  leagueName: string;
  isPrivate: boolean;
  leagueImage: string;
}

// Define the NewLeague component
const NewLeague: React.FC = () => {
  const [leagueName, setLeagueName] = useState<string>("");
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { setFeedback } = useFeedback();

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > MAX_FILE_SIZE) {
        setError("El tamaño del archivo excede el límite de 5MB.");
        return;
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError(null); // Clear previous errors
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!leagueName || !file) {
      setError(
        "Por favor complete todos los campos requeridos y suba una imagen."
      );
      return;
    }

    try {
      // First, upload the image
      const formData = new FormData();
      if (file) {
        formData.append("file", file);
      }
      const imageResponse = await apiPost<ImageUploadResponse>(
        "/images/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Then, create the league with the image URL
      const newLeague = {
        leagueName,
        isPrivate,
        leagueImage: imageResponse.imageUrl, // Assuming the imageUrl is returned
      };
      const response = await apiPost<LeagueCreationResponse>(
        "/leagues",
        newLeague
      );
      console.log("League created successfully:", response);

      setFeedback({
        message: "Liga creada exitosamente",
        severity: "success",
        open: true,
      });
    } catch (error) {
      console.error("Error creating league:", error);
      setFeedback({
        message: "Error al crear la liga",
        severity: "error",
        open: true,
      });
    }
  };

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

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
        <Box mb={2}>
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
        </Box>
        {preview && (
          <Box mb={2}>
            <img src={preview} alt="Archivo seleccionado" width="100%" />
          </Box>
        )}
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
