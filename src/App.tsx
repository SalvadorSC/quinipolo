import React from "react";
import "./App.css";
import SurveyForm from "./Routes/SurveyForm/SurveyForm";
import { Container } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AnswersForm from "./Routes/AnswersForm/AnswersForm";
import LoginForm from "./Routes/LoginForm/LoginForm";
import SignUpForm from "./Routes/SignUpForm/SignUpForm";
import MenuBar from "./Components/MenuBar/MenuBar";
import Dashboard from "./Routes/Dashboard/Dashboard";

function App() {
  // const [data, setData] = useState(null);

  /* useEffect(() => {
    fetch("http://localhost:3000/api/users")
      .then((res) => res.json())
      .then((data) => setData(data[0].username));
  }, []); */

  return (
    <React.StrictMode>
      <BrowserRouter>
        <div className="App">
          <Container maxWidth="sm">
            <Routes>
              <Route path="sign-in" element={<LoginForm />} />
              <Route path="sign-up" element={<SignUpForm />} />

              <Route path="/" element={<MenuBar />}>
                <Route path="/" element={<LoginForm />} />
                <Route path="*" element={<LoginForm />} />
                <Route path="quinipolo" element={<SurveyForm />} />
                <Route path="answer" element={<AnswersForm />} />
                <Route path="dashboard" element={<Dashboard />} />
              </Route>
              {/* <Route path="*" element={<NoMatch />} /> */}
            </Routes>
          </Container>
          {/* <BottomNav /> */}
        </div>
      </BrowserRouter>
    </React.StrictMode>
  );
}

export default App;
