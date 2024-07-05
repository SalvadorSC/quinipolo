import React, { useEffect } from "react";
import "./App.css";
import SurveyForm from "./Routes/SurveyForm/SurveyForm";
import { Container } from "@mui/material";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AnswersForm from "./Routes/AnswersForm/AnswersForm";
import LoginForm from "./Routes/LoginForm/LoginForm";
import Dashboard from "./Routes/Dashboard/Dashboard";
import QuinipoloSuccess from "./Routes/QuinipoloSuccess/QuinipoloSuccess";
import LeagueDashboard from "./Routes/LeagueDashboard/LeagueDashboard";
import { UserProvider } from "./Context/UserContext/UserContext";
import { FeedbackProvider } from "./Context/FeedbackContext/FeedbackContext";
import CorrectionSuccess from "./Routes/CorrectionSuccess/CorrectionSuccess";
import { useUser } from "@clerk/clerk-react";
import MenuBar from "./Components/MenuBar/MenuBar";
import LeagueList from "./Routes/LeagueList/LeagueList";

function App() {
  const user = useUser();

  useEffect(() => {
    localStorage.setItem("authenticated", "true");
    if (user.user) {
      localStorage.setItem("userId", user.user?.id);
      localStorage.setItem("username", user.user?.username as string);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <React.StrictMode>
      <BrowserRouter>
        <FeedbackProvider>
          <UserProvider>
            <Container maxWidth="sm">
              <Routes>
                <Route
                  path="sign-in"
                  element={user.isSignedIn ? <LoginForm /> : null}
                />

                <Route
                  path="/"
                  element={user.isSignedIn ? <MenuBar /> : <LoginForm />}
                >
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                  <Route path="crear-quinipolo" element={<SurveyForm />} />
                  <Route
                    path="quinipolo-success"
                    element={<QuinipoloSuccess />}
                  />
                  <Route
                    path="correction-success"
                    element={<CorrectionSuccess />}
                  />
                  <Route path="quinipolo" element={<AnswersForm />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route
                    path="league-dashboard"
                    element={<LeagueDashboard />}
                  />
                  <Route path="join-league" element={<LeagueList />} />
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                </Route>

                {/* <Route path="*" element={<NoMatch />} /> */}
              </Routes>
            </Container>
          </UserProvider>
        </FeedbackProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
}

export default App;
