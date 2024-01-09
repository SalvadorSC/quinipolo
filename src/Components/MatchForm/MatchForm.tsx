import {
  Autocomplete,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { SurveyData } from "../../Routes/SurveyForm/SurveyForm.types";
import styles from "./MatchForm.module.scss";
interface MatchFormProps {
  teamOptions: { waterpolo: string[]; football: string[] };
  selectedTeams: string[];
  index: number;
  setQuinipolo: Dispatch<SetStateAction<SurveyData[]>>;
  loading: boolean;
}

const MatchForm = ({
  teamOptions,
  selectedTeams,
  index,
  setQuinipolo,
  loading,
}: MatchFormProps) => {
  const initialSurveyData: SurveyData = {
    gameType: "waterpolo",
    homeTeam: "",
    awayTeam: "",
    isGame15: index === 14,
  };
  const [matchData, setMatchData] = useState<SurveyData>(initialSurveyData);

  const getTeams = (type: string) => {
    return teamOptions[(matchData.gameType as "waterpolo") || "football"]
      .filter(
        (team: string) =>
          !selectedTeams.includes(team) &&
          team !== (type === "away" ? matchData.homeTeam : matchData.awayTeam)
      )
      .sort((a: string, b: string) => -b.charAt(0).localeCompare(a.charAt(0)));
  };

  const handleChange = ({
    target: { name, value },
  }:
    | SelectChangeEvent<string>
    | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setMatchData((prevData: SurveyData) => ({ ...prevData, [name]: value }));
  };

  useEffect(() => {
    setQuinipolo((prevquinipolo) => {
      const updatedData = [...prevquinipolo];
      updatedData[index] = matchData;
      return updatedData;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchData]);

  const handleTeamChange = (
    name: "homeTeam" | "awayTeam",
    value: string | null
  ) => {
    setMatchData((prevData: SurveyData) => ({
      ...prevData,
      [name]: value ?? "",
    }));
  };

  let goalsText = "None";

  if (matchData.gameType) {
    if (matchData.gameType === "waterpolo") {
      goalsText = "Less than 9, 9 or 10, more than 10.";
    } else {
      goalsText = "0, 1 or 2, more than 2";
    }
  }

  return (
    <>
      <Typography className={styles.matchFormTitle}>
        Partit {index + 1}: <br />
      </Typography>
      <br />
      <div className={styles.matchForm} key={`matchForm-${index}`}>
        <div>
          <FormControl
            className="matchForm__gameType"
            fullWidth
            variant="outlined"
            margin="normal"
          >
            <InputLabel>Esport</InputLabel>
            <Select
              label="Game Type"
              name="gameType"
              value={matchData.gameType}
              onChange={(event) => {
                setMatchData({
                  ...matchData,
                  gameType: event.target.value as
                    | "waterpolo"
                    | "football"
                    | undefined,
                  homeTeam: "",
                  awayTeam: "",
                });
              }}
            >
              <MenuItem value="waterpolo">Waterpolo</MenuItem>
              <MenuItem value="football">Football</MenuItem>
            </Select>
          </FormControl>

          {loading ? (
            <>
              <Skeleton variant="rectangular" sx={{ mt: 2 }} height={60} />
              <br />
              <Skeleton variant="rectangular" height={60} />
            </>
          ) : (
            <>
              <Autocomplete
                freeSolo
                disabled={!matchData.gameType}
                key={`homeTeam-${index}`}
                options={getTeams("home")}
                groupBy={(option: string) => option.charAt(0)}
                renderInput={(params) => (
                  <TextField
                    required
                    {...params}
                    label="Home Team"
                    variant="outlined"
                    name="homeTeam"
                    value={matchData.homeTeam}
                    onChange={(e) => handleChange(e)}
                    fullWidth
                    margin="normal"
                  />
                )}
                onChange={(_, value) => handleTeamChange("homeTeam", value)}
              />

              <Autocomplete
                disabled={!matchData.gameType}
                key={`awayTeam-${index}`}
                options={getTeams("away")}
                freeSolo
                groupBy={(option: string) => option.charAt(0)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    label="Away Team"
                    variant="outlined"
                    name="awayTeam"
                    value={matchData.awayTeam}
                    onChange={(e) => handleChange(e)}
                    fullWidth
                    margin="normal"
                  />
                )}
                onChange={(_, value) => handleTeamChange("awayTeam", value)}
              />
            </>
          )}

          {index === 14 && (
            <div style={{ marginTop: 10 }}>
              <p>Número de gols:</p>
              <br />
              <p>{goalsText}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MatchForm;
