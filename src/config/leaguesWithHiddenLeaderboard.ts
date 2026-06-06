/** League UUIDs where leaderboard points/results must not be shown. */
const LEAGUES_WITHOUT_LEADERBOARD_RESULTS = [];

export function shouldHideLeaderboardResults(
  leagueId?: string | null
): boolean {
  return (
    !!leagueId && LEAGUES_WITHOUT_LEADERBOARD_RESULTS.includes(leagueId)
  );
}
