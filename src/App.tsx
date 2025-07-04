import React from "react";
import "./App.css";
import SurveyForm from "./Routes/SurveyForm/SurveyForm";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { UserProvider } from "./Context/UserContext/UserContext";
import { FeedbackProvider } from "./Context/FeedbackContext/FeedbackContext";
import { useUser } from "@clerk/clerk-react";
import { ThemeProvider } from "./Context/ThemeContext/ThemeContext";
import AnswersForm from "./Routes/AnswersForm/AnswersForm";
import LoginForm from "./Routes/LoginForm/LoginForm";
import Dashboard from "./Routes/Dashboard/Dashboard";
import Landing from "./Routes/Landing/Landing";
import QuinipoloSuccess from "./Routes/QuinipoloSuccess/QuinipoloSuccess";
import LeagueDashboard from "./Routes/LeagueDashboard/LeagueDashboard";
import MenuBar from "./Components/MenuBar/MenuBar";
import LeagueList from "./Routes/LeagueList/LeagueList";
import SubscriptionPage from "./Routes/SubscriptionPage/SubscriptionPage";
import NewLeague from "./Routes/NewLeague/NewLeague";
import CorrectionSuccess from "./Routes/CorrectionSuccess/CorrectionSuccess";
import { useTranslation } from 'react-i18next';

function App() {
  const user = useUser();
  const { t } = useTranslation();

  return (
    <React.StrictMode>
      <BrowserRouter>
        <FeedbackProvider>
          <UserProvider>
            <ThemeProvider>
              <Routes>
                <Route
                  path="sign-in"
                  element={
                    !user.isSignedIn ? (
                      <LoginForm />
                    ) : (
                      <Navigate to="/dashboard" />
                    )
                  }
                />

                {/* Auth callback route for magic link deep linking */}
                {/* <Route path="auth/callback" element={<AuthCallback />} /> */}

                <Route
                  path="/"
                  element={user.isSignedIn ? <MenuBar /> : <Landing />}
                >
                  <Route
                    path="/"
                    element={user.isSignedIn ? <Dashboard /> : <Landing />}
                  />
                  <Route path="crear-quinipolo" element={<SurveyForm />} />
                  <Route
                    path="quinipolo-success"
                    element={<QuinipoloSuccess />}
                  />
                  <Route
                    path="correction-success"
                    element={<CorrectionSuccess />}
                  />

                  <Route path="quinipolo" element={<AnswersForm />}>
                    <Route path="correct" element={<AnswersForm />} />
                  </Route>

                  <Route path="dashboard" element={<Dashboard />} />
                  <Route
                    path="league-dashboard"
                    element={<LeagueDashboard />}
                  />
                  <Route path="join-league" element={<LeagueList />} />
                  <Route path="subscribe" element={<SubscriptionPage />} />
                  <Route path="crear-liga" element={<NewLeague />} />
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                </Route>

                {/* <Route path="*" element={<NoMatch />} /> */}
              </Routes>
            </ThemeProvider>
          </UserProvider>
        </FeedbackProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
}

export default App;
