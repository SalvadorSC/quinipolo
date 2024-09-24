import { Box, Pagination, Tab } from "@mui/material";
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../Context/UserContext/UserContext";
import { useFeedback } from "../../Context/FeedbackContext/FeedbackContext";
import { apiGet } from "../../utils/apiUtils";
import Skeleton from "antd/lib/skeleton";

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
            `/api/users/user/quinipolos?username=${username}`
          );
        }
        setQuinipolos(data);
      } catch (error) {
        console.error(error);
        setFeedback({
          message: "Error cargando los datos del usuario",
          severity: "error",
          open: true,
        });
      } finally {
        setLoading(false);
      }
    },
    [appLocation, leagueId, setFeedback, username]
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
                <Tab label="Pendientes" value="1" />
                <Tab label="Anteriores" value="2" />
                <Tab label="Todas" value="3" />
              </TabList>
            </Box>
            <TabPanel sx={{ p: 0, mt: 2 }} value="1">
              <TabPanelContent
                quinipolos={quinipolos.filter((quinipolo) => {
                  if (quinipolo.isDeleted) {
                    return false;
                  }
                  return (
                    /* moderatedLeagues.includes(quinipolo.leagueName) ||
                    !quinipolo.hasBeenCorrected || */
                    (moderatedLeagues.includes(quinipolo.leagueName) &&
                      !quinipolo.hasBeenCorrected) ||
                    (quinipolo.endDate > new Date().toISOString() &&
                      !quinipolo.participantsWhoAnswered.includes(username))
                  );
                })}
                fallBackText={"No tienes quinipolos pendientes"}
                username={username}
                moderatedLeagues={moderatedLeagues}
              />
            </TabPanel>
            <TabPanel sx={{ p: 0, mt: 2 }} value="2">
              <TabPanelContent
                quinipolos={quinipolos.filter(
                  (quinipolo) =>
                    quinipolo.endDate <= new Date().toISOString() &&
                    (!leagueId || quinipolo.leagueId === leagueId)
                )}
                username={username}
                moderatedLeagues={moderatedLeagues}
                fallBackText={"No tienes quinipolos anteriores"}
              />
            </TabPanel>
            <TabPanel sx={{ p: 0, mt: 2 }} value="3">
              <TabPanelContent
                quinipolos={quinipolos}
                username={username}
                moderatedLeagues={moderatedLeagues}
                fallBackText={"No hay quinipolos"}
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
