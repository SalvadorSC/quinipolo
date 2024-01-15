import React, { useState } from "react";
import "./App.css";
import SurveyForm from "./Routes/SurveyForm/SurveyForm";
import { Container } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AnswersForm from "./Routes/AnswersForm/AnswersForm";
import LoginForm from "./Routes/LoginForm/LoginForm";
import SignUpForm from "./Routes/SignUpForm/SignUpForm";
import MenuBar from "./Components/MenuBar/MenuBar";
import Dashboard from "./Routes/Dashboard/Dashboard";
import QuinipoloSuccess from "./Routes/QuinipoloSuccess/QuinipoloSuccess";
import Feedback from "./Components/Feedback/Feedback";

function App() {
  const [feedback, setFeedback] = useState<{
    message: string;
    severity: "success" | "info" | "warning" | "error";
    color: string;
    open: boolean;
  }>({ message: "", severity: "info", color: "", open: false });

  const handleOpenFeedback = (
    message: string,
    severity: "success" | "info" | "warning" | "error",
    color: string
  ) => {
    setFeedback({ message, severity, color, open: true });
  };

  const handleCloseFeedback = () => {
    setFeedback({ message: "", severity: "info", color: "", open: false });
  };

  return (
    <React.StrictMode>
      <BrowserRouter>
        <Container maxWidth="sm">
          <Routes>
            <Route path="sign-in" element={<LoginForm />} />
            <Route path="sign-up" element={<SignUpForm />} />

            <Route path="/" element={<MenuBar />}>
              <Route path="/" element={<LoginForm />} />
              <Route path="*" element={<LoginForm />} />
              <Route
                path="crear-quinipolo"
                element={<SurveyForm handleOpenFeedback={handleOpenFeedback} />}
              />
              <Route
                path="quinipolo-success"
                element={
                  <QuinipoloSuccess handleOpenFeedback={handleOpenFeedback} />
                }
              />
              <Route path="quinipolo" element={<AnswersForm />} />
              <Route path="dashboard" element={<Dashboard />} />
            </Route>
            {/* <Route path="*" element={<NoMatch />} /> */}
          </Routes>
          <Feedback
            isOpen={feedback.open}
            onClose={handleCloseFeedback}
            severity={feedback.severity}
            message={feedback.message}
            color={feedback.color}
          />
        </Container>
      </BrowserRouter>
    </React.StrictMode>
  );
}

export default App;
