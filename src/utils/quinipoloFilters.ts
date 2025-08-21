import { QuinipoloType } from "../types/quinipolo";
import { isUserModerator, UserLeague } from "./moderatorUtils";

export interface QuinipoloFilters {
  userLeagues?: UserLeague[];
  username?: string;
  leagueId?: string;
}

/**
 * Filters quinipolos for the "pending" tab
 * Shows quinipolos that are:
 * - Not deleted
 * - Moderated and uncorrected (if user is moderator)
 * - Active and unanswered by the user
 * - Recent (within 30 days) and uncorrected
 */
export const filterPendingQuinipolos = (
  quinipolos: QuinipoloType[],
  { userLeagues, username }: QuinipoloFilters
): QuinipoloType[] => {
  if (!userLeagues || !username) {
    return [];
  }

  return quinipolos.filter((quinipolo) => {
    if (quinipolo.is_deleted) return false;

    const today = new Date();
    const date30DaysAgo = new Date(today);
    date30DaysAgo.setDate(today.getDate() - 30);

    const isModeratedAndUncorrected =
      isUserModerator(userLeagues, quinipolo.league_id) &&
      !quinipolo.has_been_corrected;

    const isActiveAndUnanswered =
      quinipolo.end_date > today.toISOString() &&
      !quinipolo.participants_who_answered?.includes(username);

    const isRecentAndUncorrected =
      quinipolo.end_date > date30DaysAgo.toISOString() &&
      !quinipolo.has_been_corrected;

    return (
      isModeratedAndUncorrected ||
      isActiveAndUnanswered ||
      isRecentAndUncorrected
    );
  });
};

/**
 * Filters quinipolos for the "previous" tab
 * Shows quinipolos that are:
 * - Ended (past end date)
 * - Corrected
 * - Optional: filtered by specific league
 */
export const filterPreviousQuinipolos = (
  quinipolos: QuinipoloType[],
  { leagueId }: QuinipoloFilters
): QuinipoloType[] => {
  return quinipolos.filter(
    (quinipolo) =>
      quinipolo.end_date <= new Date().toISOString() &&
      (!leagueId || quinipolo.league_id === leagueId) &&
      quinipolo.has_been_corrected
  );
};

/**
 * Returns all quinipolos (no filtering)
 */
export const filterAllQuinipolos = (
  quinipolos: QuinipoloType[]
): QuinipoloType[] => {
  return quinipolos;
};
