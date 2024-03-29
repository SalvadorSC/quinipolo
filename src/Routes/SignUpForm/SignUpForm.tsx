import {
  Avatar,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SignUpForm = () => {
  const [participateGlobalQuinipolo, setParticipateGlobalQuinipolo] =
    React.useState(false);
  const [extraEmailsOK, setExtraEmailsOK] = React.useState(false);
  const newUser = {
    fullName: "",
    username: "",
    password: "",
    email: "",
    role: "user",
    leagues: [],
  };
  const navigate = useNavigate();
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    axios
      .post(`process.env.REACT_APP_API_BASE_URL/api/auth/signup`, {
        ...newUser,
        username: data.get("username") as string,
        email: data.get("email") as string,
        password: data.get("password") as string,
        fullName: `${data.get("firstName")} ${data.get("lastName")}`,
        leagues: participateGlobalQuinipolo ? ["global"] : [],
      })
      .then(() => {
        navigate("/sign-in");
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <div>
      <Paper elevation={3} sx={{ width: "100%", p: 4, marginTop: 16 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}></Avatar>
          <Typography component="h1" variant="h5">
            Formulario de registro
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="Nombre"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Apellidos"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="Usuario"
                  name="username"
                  autoComplete="username"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Correo"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Contraseña"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  sx={{ textAlign: "left", width: "100%" }}
                  control={<Checkbox value={participateGlobalQuinipolo} />}
                  onChange={() =>
                    setParticipateGlobalQuinipolo(!participateGlobalQuinipolo)
                  }
                  label="Quiero participar en la quinipolo global. (Cuando esté disponible)."
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  sx={{ textAlign: "left", width: "100%" }}
                  control={
                    <Checkbox
                      value="allowExtraEmails"
                      onChange={() => setExtraEmailsOK(!extraEmailsOK)}
                      required
                    />
                  }
                  label="Acepto recibir posibles correos electrónicos de Quinipolo. (Si los enviamos, que no se sabe si ocurrirá)."
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              disabled={!extraEmailsOK}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Registrarse
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to="/sign-in">Ya tienes una cuenta? Inicia sesión</Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Paper>
    </div>
  );
};

export default SignUpForm;
