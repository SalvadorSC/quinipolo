import React, { SetStateAction } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import dayjs from "dayjs";
import style from "./RequestsTable.module.scss";
import CheckIcon from "@mui/icons-material/Check";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import { apiPut } from "../../utils/apiUtils";
import { useFeedback } from "../../Context/FeedbackContext/FeedbackContext";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { LeaguesTypes } from "../../Routes/LeagueDashboard/LeagueDashboard";

interface IRequest {
  userId: string;
  username: string;
  date: Date;
  _id: string;
}

interface IRequestsTable {
  requests: IRequest[];
  leagueId: string;
  setLeagueData: React.Dispatch<SetStateAction<LeaguesTypes>>;
  requestType: "moderator" | "participant";
}

const RequestsTable = ({
  requests,
  leagueId,
  setLeagueData,
  requestType,
}: IRequestsTable) => {
  const { setFeedback } = useFeedback();

  const handleAccept = (id: string) => {
    apiPut(`/api/leagues/${leagueId}/${requestType}-petitions/${id}/accept`, {})
      .then((data: any) => {
        setLeagueData(data);
        setFeedback({
          message: "Petición aceptada",
          severity: "success",
          open: true,
        });
      })
      .catch((error) => {
        console.error(error);
        setFeedback({
          message: "Error aceptando la petición",
          severity: "error",
          open: true,
        });
      });
  };

  const handleReject = (id: string) => {
    apiPut(`/api/leagues/${leagueId}/${requestType}-petitions/${id}/reject`, {})
      .then((data: any) => {
        setLeagueData(data);
        setFeedback({
          message: "Petición rechazada",
          severity: "success",
          open: true,
        });
      })
      .catch((error) => {
        console.error(error);
        setFeedback({
          message: "Error rechazando la petición",
          severity: "error",
          open: true,
        });
      });
  };

  return (
    <Accordion sx={{ m: 0 }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
        sx={{ textAlign: "left" }}
      >
        Peticiones para{" "}
        {requestType === "moderator" ? "moderar" : "participar en"} esta liga (
        {requests.length})
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0 }}>
        {requests.length > 0 ? (
          <TableContainer
            className={style.tableContainer}
            sx={{ borderRadius: "0" }}
            component={Paper}
          >
            <Table aria-label={`${requestType} requests table`}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "600" }}>Usuario</TableCell>
                  <TableCell sx={{ fontWeight: "600" }}>
                    Fecha de petición
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: "600" }}
                    className={style.actionColumn}
                  >
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.userId}>
                    <TableCell>{request.username}</TableCell>
                    <TableCell>
                      {dayjs(request.date).format("DD/MM/YYYY")}
                    </TableCell>
                    <TableCell className={style.actionColumn}>
                      <Button
                        className={`${style.buttonAction} ${style.buttonAccept}`}
                        variant="contained"
                        color="primary"
                        onClick={() => handleAccept(request._id)}
                      >
                        <CheckIcon />
                      </Button>
                      <Button
                        className={`${style.buttonAction} ${style.buttonReject}`}
                        variant="contained"
                        color="secondary"
                        onClick={() => handleReject(request._id)}
                      >
                        <DoDisturbIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <p className={style.noActionsMessage}>
            No hay peticiones para{" "}
            {requestType === "moderator" ? "moderar" : "participar en"} esta
            liga.
          </p>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default RequestsTable;
