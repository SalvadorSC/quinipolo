export interface SurveyData {
  gameType: "waterpolo" | "football" | undefined;
  homeTeam: string;
  awayTeam: string;
  date: Date | null;
  isGame15: boolean;
}
