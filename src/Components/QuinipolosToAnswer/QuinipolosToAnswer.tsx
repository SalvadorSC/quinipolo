import { Box, Pagination, Tab } from "@mui/material";
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../Context/UserContext/UserContext";
import { useFeedback } from "../../Context/FeedbackContext/FeedbackContext";
import { apiGet } from "../../utils/apiUtils";
import Skeleton from "antd/lib/skeleton";
import { useTranslation } from 'react-i18next';

import { TabContext, TabList, TabPanel } from "@mui/lab";
import QuinipoloCard from "../QuinipoloCard/QuinipoloCard";
import styles from "./QuinipolosToAnswer.module.scss";

const QuinipolosToAnswer = ({
  leagueId,
  wrapperLoading = false,
  appLocation,
}: {
  leagueId?: string;
  wrapperLoading?: boolean;
  appLocation?: "league-dashboard" | "user-dashboard";
}) => {
  const {
    userData: { moderatedLeagues, username },
  } = useUser();
  const [value, setValue] = useState<string>("1");
  const { setFeedback } = useFeedback();
  const [loading, setLoading] = useState<boolean>(false);
  const [quinipolos, setQuinipolos] = useState<any[]>([]);
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
          data = await apiGet(
            `/api/users/me/quinipolos`
          );
        }
        setQuinipolos(data);
      } catch (error) {
        console.error(error);
        setFeedback({
          message: t('error'),
          severity: "error",
          open: true,
        });
      } finally {
        setLoading(false);
      }
    },
    [appLocation, leagueId, setFeedback, username, t]
  );

  useEffect(() => {
    if (username) {
      fetchQuinipolos(username);
    }
  }, [fetchQuinipolos, username]);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <div>
      <hr />
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
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                <Tab label={t('pending')} value="1" />
                <Tab label={t('previous')} value="2" />
                <Tab label={t('all')} value="3" />
              </TabList>
            </Box>
            <TabPanel sx={{ p: 0, mt: 2 }} value="1">
              <TabPanelContent
                quinipolos={quinipolos.filter((quinipolo) => {
                  if (quinipolo.isDeleted) return false;

                  const today = new Date();
                  const date30DaysAgo = new Date(today);
                  date30DaysAgo.setDate(today.getDate() - 30);

                  const isModeratedAndUncorrected =
                    moderatedLeagues.includes(quinipolo.leagueName) &&
                    !quinipolo.hasBeenCorrected;
                  const isActiveAndUnanswered =
                    quinipolo.endDate > today.toISOString() &&
                    !quinipolo.participantsWhoAnswered.includes(username);
                  const isRecentAndUncorrected =
                    quinipolo.endDate > date30DaysAgo.toISOString() &&
                    !quinipolo.hasBeenCorrected;

                  return (
                    isModeratedAndUncorrected ||
                    isActiveAndUnanswered ||
                    isRecentAndUncorrected
                  );
                })}
                fallBackText={t('noPendingQuinipolos')}
                username={username}
                moderatedLeagues={moderatedLeagues}
              />
            </TabPanel>
            <TabPanel sx={{ p: 0, mt: 2 }} value="2">
              <TabPanelContent
                quinipolos={quinipolos.filter(
                  (quinipolo) =>
                    quinipolo.endDate <= new Date().toISOString() &&
                    (!leagueId || quinipolo.leagueId === leagueId) &&
                    quinipolo.hasBeenCorrected
                )}
                username={username}
                moderatedLeagues={moderatedLeagues}
                fallBackText={t('noPreviousQuinipolos')}
              />
            </TabPanel>
            <TabPanel sx={{ p: 0, mt: 2 }} value="3">
              <TabPanelContent
                quinipolos={quinipolos}
                username={username}
                moderatedLeagues={moderatedLeagues}
                fallBackText={t('noQuinipolos')}
              />
            </TabPanel>
          </TabContext>
        )}
      </Box>
    </div>
  );
};

const TabPanelContent = ({
  quinipolos,
  username,
  moderatedLeagues,
  fallBackText,
}: {
  quinipolos: any[];
  username: string;
  moderatedLeagues: string[];
  fallBackText?: string;
}) => {
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
      {totalPages > 1 ? (
        <Pagination
          onChange={handlePageChange}
          count={totalPages}
          className={styles.pagination}
        />
      ) : null}
      {quinipolos.length > 0 ? (
        currentItems.map((quinipolo) => {
          const deadline = new Date(quinipolo.endDate);
          const deadlineIsInPast = deadline.getTime() < new Date().getTime();
          return (
            <QuinipoloCard
              key={quinipolo._id}
              deadlineIsInPast={deadlineIsInPast}
              quinipolo={quinipolo}
              moderatedLeagues={moderatedLeagues}
              username={username}
            />
          );
        })
      ) : (
        <p className={styles.noActionsMessage}>{fallBackText}</p>
      )}
    </>
  );
};

export default QuinipolosToAnswer;
