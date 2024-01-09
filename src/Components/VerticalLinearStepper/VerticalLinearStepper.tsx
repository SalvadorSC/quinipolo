// Update the VerticalLinearStepper component definition:
// Change this:
// export default function VerticalLinearStepper() {

import {
  Box,
  Button,
  Paper,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import MatchForm from "../MatchForm/MatchForm";
import { Dispatch, SetStateAction, useState } from "react";
import { SurveyData } from "../../Routes/SurveyForm/SurveyForm.types";

interface VerticalLinearStepperProps {
  teamOptions: { waterpolo: string[]; football: string[] };
  selectedTeams: string[];
  matchArray: any[];
  quinipolo: SurveyData[];
  setQuinipolo: Dispatch<SetStateAction<SurveyData[]>>;
}

// To this:
export default function VerticalLinearStepper({
  teamOptions,
  selectedTeams,
  matchArray,
  setQuinipolo,
}: VerticalLinearStepperProps) {
  const [activeStep, setActiveStep] = useState<number>(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep: number) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep: number) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  // Inside the return statement, replace the existing code with the following:
  return (
    <Box sx={{ maxWidth: "100%" }}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {matchArray.map((_, index) => (
          <Step key={index}>
            <StepLabel
              sx={{ color: "text.primary", cursor: "pointer" }}
              onClick={() => {
                if (activeStep > index) setActiveStep(index);
              }}
            >
              {`Partit ${index + 1}: ${
                index === matchArray.length - 1
                  ? "Escull el ple al quinze"
                  : "Prepara el partit"
              }`}
            </StepLabel>
            <StepContent>
              <MatchForm
                teamOptions={teamOptions}
                selectedTeams={selectedTeams}
                index={index}
                setQuinipolo={setQuinipolo}
                loading={false}
              />
              <Box sx={{ mb: 2 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "flex-end",
                  }}
                >
                  {activeStep > 0 && (
                    <Button
                      disabled={index === 0}
                      onClick={handleBack}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Back
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {index === matchArray.length - 1 ? "Finish" : "Continue"}
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === matchArray.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
            Reset
          </Button>
        </Paper>
      )}
    </Box>
  );
}
