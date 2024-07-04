import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import styles from "./LoginForm.module.scss";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useFeedback } from "../../Context/FeedbackContext/FeedbackContext";
import { SignIn } from "@clerk/clerk-react";

const LoginForm = () => {
  const navigate = useNavigate();
  const { setFeedback } = useFeedback();
  const [loading, setLoading] = React.useState(false);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/login`, {
        email: "aaaa@gmail.com", // data.get("email"),
        password: "aaaa", // data.get("password"),
      })
      .then((response) => {
        localStorage.setItem("authenticated", "true");
        localStorage.setItem("userId", response.data.user.userId);
        localStorage.setItem("userId", response.data.user.userId);
        console.log("Logging in", response.data.user.userId);
        navigate("/dashboard");
      })
      .catch((error) => {
        setLoading(false);
        setFeedback({
          message:
            "Error iniciando sesión. Puede que el servidor este inactivo.",
          severity: "error",
          open: true,
        });
        console.error("Error:", error);
      });
    // Assuming your backend returns a token upon successful login
    // const token = response.data.token;

    // Store the token in local storage or a state management solution
    // localStorage.setItem("token", token);

    // Redirect to a protected route or the user's dashboard
    // history.push("/dashboard");
  };

  return (
    <div className={styles.loginContainer}>
      <SignIn />
      {/* <Paper elevation={3} sx={{ width: "100%", p: 4 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            height: "100%",
          }}
        >
          {loading ? (
            <div className={styles.loaderContainer}>
              <Typography component="h1" variant="h5">
                Iniciando sesión...
              </Typography>
              <CircularProgress />
            </div>
          ) : (
            <>
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}></Avatar>
              <Typography component="h1" variant="h5">
                Inicio de sesión
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ mt: 1 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Correo"
                  name="email"
                  autoComplete="email"
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Contraseña"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Iniciar Sesión
                </Button>
                <Grid container>
                  <Grid item xs sx={{ mt: 1 }}>
                    <Link to="/error">Has olvidado tu contraseña?</Link>
                  </Grid>
                  <Grid item sx={{ mt: 2, textAlign: "center", width: "100%" }}>
                    <Link to="/sign-up">No tienes una cuenta? Registrate!</Link>
                  </Grid>
                </Grid>
              </Box>
            </>
          )}
        </Box>
      </Paper> */}
    </div>
  );
};

export default LoginForm;
