export interface SurveyData {
  gameType: "waterpolo" | "football";
  homeTeam: string;
  awayTeam: string;
  date: Date | null;
  isGame15: boolean;
}
