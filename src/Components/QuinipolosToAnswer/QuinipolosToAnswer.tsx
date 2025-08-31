import { Box, Pagination, Tab } from "@mui/material";
import React, { useEffect, useState, useCallback } from "react";
import { useUser } from "../../Context/UserContext/UserContext";
import { useFeedback } from "../../Context/FeedbackContext/FeedbackContext";
import { apiGet } from "../../utils/apiUtils";
import Skeleton from "antd/lib/skeleton";
import { useTranslation } from "react-i18next";
import {
  filterPendingQuinipolos,
  filterPreviousQuinipolos,
  filterAllQuinipolos,
} from "../../utils/quinipoloFilters";

import { TabContext, TabList, TabPanel } from "@mui/lab";
import QuinipoloCard from "../QuinipoloCard/QuinipoloCard";
import styles from "./QuinipolosToAnswer.module.scss";
import {
  QuinipolosToAnswerProps,
  QuinipoloType,
  TabPanelContentProps,
} from "../../types/quinipolo";

const QuinipolosToAnswer = ({
  leagueId,
  wrapperLoading = false,
  appLocation,
}: QuinipolosToAnswerProps) => {
  const {
    userData: { userLeagues, username },
  } = useUser();

  const [value, setValue] = useState<string>("1");
  const { setFeedback } = useFeedback();
  const [loading, setLoading] = useState<boolean>(false);
  const [quinipolos, setQuinipolos] = useState<QuinipoloType[]>([
    // Latest pending quinipolos (first page)
    {
      id: "1",
      league_id: "global",
      league_name: "Global",
      quinipolo: [
        {
          gameType: "waterpolo",
          homeTeam: "Barcelona",
          awayTeam: "Real Madrid",
          date: new Date("2024-12-25T20:00:00"),
          isGame15: false,
        },
        {
          gameType: "football",
          homeTeam: "Atlético Madrid",
          awayTeam: "Sevilla",
          date: new Date("2024-12-26T21:00:00"),
          isGame15: false,
        },
      ],
      end_date: "2025-09-25T23:59:59",
      has_been_corrected: false,
      creation_date: "2024-12-20T10:00:00",
      is_deleted: false,
      answered: false,
    },
    {
      id: "2",
      league_id: "personal",
      league_name: "Tu liga personalizada",
      quinipolo: [
        {
          gameType: "waterpolo",
          homeTeam: "CN Sabadell",
          awayTeam: "CN Terrassa",
          date: new Date("2024-12-27T19:30:00"),
          isGame15: true,
        },
      ],
      end_date: "2025-09-26T23:59:59",
      has_been_corrected: false,
      creation_date: "2024-12-21T14:30:00",
      is_deleted: false,
      answered: false,
    },
    // Additional quinipolos for pagination (pages 2-3)
    {
      id: "3",
      league_id: "rival",
      league_name: "La liga de tu equipo rival",
      quinipolo: [
        {
          gameType: "football",
          homeTeam: "Valencia",
          awayTeam: "Villarreal",
          date: new Date("2024-12-28T18:00:00"),
          isGame15: false,
        },
      ],
      end_date: "2025-09-27T23:59:59",
      has_been_corrected: false,
      creation_date: "2024-12-22T09:15:00",
      is_deleted: false,
      answered: false,
    },
    {
      id: "4",
      league_id: "global",
      league_name: "Global",
      quinipolo: [
        {
          gameType: "waterpolo",
          homeTeam: "CN Barceloneta",
          awayTeam: "CN Mataró",
          date: new Date("2024-12-29T20:30:00"),
          isGame15: false,
        },
      ],
      end_date: "2025-09-28T23:59:59",
      has_been_corrected: false,
      creation_date: "2024-12-23T11:45:00",
      is_deleted: false,
      answered: false,
    },
    {
      id: "5",
      league_id: "personal",
      league_name: "Tu liga personalizada",
      quinipolo: [
        {
          gameType: "football",
          homeTeam: "Athletic Club",
          awayTeam: "Real Sociedad",
          date: new Date("2024-12-30T21:00:00"),
          isGame15: false,
        },
      ],
      end_date: "2025-09-29T23:59:59",
      has_been_corrected: false,
      creation_date: "2024-12-24T16:20:00",
      is_deleted: false,
      answered: false,
    },
    {
      id: "6",
      league_id: "rival",
      league_name: "La liga de tu equipo rival",
      quinipolo: [
        {
          gameType: "waterpolo",
          homeTeam: "CN Sant Andreu",
          awayTeam: "CN Catalunya",
          date: new Date("2024-12-31T19:00:00"),
          isGame15: true,
        },
      ],
      end_date: "2025-09-30T23:59:59",
      has_been_corrected: false,
      creation_date: "2024-12-25T13:10:00",
      is_deleted: false,
      answered: false,
    },
  ]);
  const { t } = useTranslation();

  const fetchQuinipolos = useCallback(
    async (userId: string) => {
      setLoading(true);
      try {
        let data: any;
        if (appLocation === "league-dashboard") {
          data = await apiGet(
            `/api/leagues/league/${leagueId}/leagueQuinipolos`
          );
        } else {
          data = await apiGet(`/api/users/me/quinipolos`);
        }
        setQuinipolos(data);
      } catch (error) {
        console.error(error);
        setFeedback({
          message: t("error"),
          severity: "error",
          open: true,
        });
      } finally {
        setLoading(false);
      }
    },
    [appLocation, leagueId, setFeedback, t]
  );

  // Commented out for screenshot purposes - using mock data instead
  // useEffect(() => {
  //   if (username) {
  //     fetchQuinipolos(username);
  //   }
  // }, [fetchQuinipolos, username]);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
          typography: "body1",
          mt: loading || wrapperLoading ? 2 : 0,
        }}
      >
        {loading || wrapperLoading ? (
          <Skeleton />
        ) : (
          <TabContext value={value}>
            <TabList onChange={handleChange} aria-label="Quinipolos">
              <Tab label={t("pending")} value="1" />
              <Tab label={t("previous")} value="2" />
              <Tab label={t("all")} value="3" />
            </TabList>
            <TabPanel sx={{ p: 0, mt: 2 }} value="1">
              <TabPanelContent
                quinipolos={filterPendingQuinipolos(quinipolos, {
                  userLeagues,
                  username,
                })}
                fallBackText={t("noPendingQuinipolos")}
                username={username}
                userLeagues={userLeagues}
              />
            </TabPanel>
            <TabPanel sx={{ p: 0, mt: 2 }} value="2">
              <TabPanelContent
                quinipolos={filterPreviousQuinipolos(quinipolos, {
                  leagueId,
                  userLeagues,
                  username,
                })}
                username={username}
                userLeagues={userLeagues}
                fallBackText={t("noPreviousQuinipolos")}
              />
            </TabPanel>
            <TabPanel sx={{ p: 0, mt: 2 }} value="3">
              <TabPanelContent
                quinipolos={quinipolos}
                username={username}
                userLeagues={userLeagues}
                fallBackText={t("noQuinipolos")}
              />
            </TabPanel>
          </TabContext>
        )}
      </Box>
    </>
  );
};

const TabPanelContent = ({
  quinipolos,
  username,
  userLeagues,
  fallBackText,
}: TabPanelContentProps) => {
  const itemsPerPage = 2;
  const totalItems = quinipolos.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = quinipolos.slice(indexOfFirstItem, indexOfLastItem);
  const handlePageChange = (e: any, page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      {quinipolos.length > 0 ? (
        currentItems.map((quinipolo) => {
          const deadline = new Date(quinipolo.end_date);
          const deadlineIsInPast = deadline.getTime() < new Date().getTime();
          return (
            <QuinipoloCard
              key={quinipolo.id}
              deadlineIsInPast={deadlineIsInPast}
              quinipolo={quinipolo}
              userLeagues={userLeagues}
              username={username}
            />
          );
        })
      ) : (
        <p className={styles.noActionsMessage}>{fallBackText}</p>
      )}
      {totalPages > 1 ? (
        <Pagination
          onChange={handlePageChange}
          count={totalPages}
          className={styles.pagination}
        />
      ) : null}
    </>
  );
};

export default QuinipolosToAnswer;
