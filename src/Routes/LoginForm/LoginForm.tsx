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
import styles from "./LoginForm.module.scss";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const LoginForm = () => {
  const navigate = useNavigate();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
    axios
      .post("/api/auth/login", {
        email: data.get("email"),
        password: data.get("password"),
      })
      .then((response) => {
        console.log(response.data);
        navigate("/dashboard");
        localStorage.setItem("authenticated", "true");
      })
      .catch((error) => console.error("Error:", error));
    // Assuming your backend returns a token upon successful login
    // const token = response.data.token;

    // Store the token in local storage or a state management solution
    // localStorage.setItem("token", token);

    // Redirect to a protected route or the user's dashboard
    // history.push("/dashboard");
  };

  return (
    <div className={styles.loginContainer}>
      <Paper elevation={3} sx={{ width: "100%", p: 4 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}></Avatar>
          <Typography component="h1" variant="h5">
            Log in
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
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs sx={{ mt: 1 }}>
                <Link to="/error">Forgot password?</Link>
              </Grid>
              <Grid item sx={{ mt: 2, textAlign: "center", width: "100%" }}>
                <Link to="/sign-up">Don't have an account? Sign Up</Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Paper>
    </div>
  );
};

export default LoginForm;
