/** League UUIDs where leaderboard points/results must not be shown. */
const LEAGUES_WITHOUT_LEADERBOARD_RESULTS = [
  "4cae8d4-f3bd-42a5-a-8997-e4fdb0182", // Sant Feliu
];

export function shouldHideHideLeaderboardResults(
  leagueId?: string | null
): boolean {
  return (
    !!leagueId && LEAGUES_WITHOUT_LEADERBOARD_RESULTS.includes(leagueId)
  );
}