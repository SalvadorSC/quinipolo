import React from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import style from "./AnswersForm.module.scss";

interface GoalsToggleButtonGroupProps {
  teamType: "home" | "away";
  teamName: string;
  goals: string;
  correctGoals: string;
  matchType: "waterpolo" | "football";
  onChange: (event: React.MouseEvent<HTMLElement>, newValue: string) => void;
  seeUserAnswersModeOn: string | null;
  quinipoloHasBeenCorrected: boolean;
}

const GoalsToggleButtonGroup: React.FC<GoalsToggleButtonGroupProps> = ({
  teamType,
  teamName,
  goals,
  correctGoals,
  matchType,
  onChange,
  seeUserAnswersModeOn,
  quinipoloHasBeenCorrected,
}) => {
  const values =
    matchType === "waterpolo"
      ? ["9/10", `9/10__${teamType}`]
      : ["1/2", `1/2__${teamType}`];

  const getButtonClassName = (value: string) => {
    if (!seeUserAnswersModeOn || !quinipoloHasBeenCorrected) return "";
    else if (correctGoals === value) return style.correctAnswer;
    else if (goals === value) return style.answerIsWrong;
    return "";
  };

  return (
    <div>
      <p>Gols {teamName}:</p>
      <ToggleButtonGroup
        color="primary"
        value={goals}
        exclusive
        onChange={onChange}
        aria-label="Match winner"
      >
        <ToggleButton value={`-__${teamType}`}>
          <span className={getButtonClassName(`-__${teamType}`)}>-</span>
        </ToggleButton>
        <ToggleButton value={values[1]}>
          <span className={getButtonClassName(values[1])}>{values[0]} </span>
        </ToggleButton>
        <ToggleButton value={`+__${teamType}`}>
          <span className={getButtonClassName(`+__${teamType}`)}>+</span>
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
};

export default GoalsToggleButtonGroup;
