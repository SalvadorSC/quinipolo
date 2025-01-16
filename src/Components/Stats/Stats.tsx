import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";

type Result = {
  username: string;
  pointsEarned?: number;
  totalPoints: number;
  correct15thGame: boolean;
  nQuinipolosParticipated: number;
  averagePoints?: number;
};

const Stats = ({ results }: { results: Result[] }) => {
  // Calculate average points per participation and sort the results
  const sortedResults = results
    .map((row) => ({
      ...row,
      averagePoints: row.nQuinipolosParticipated
        ? row.totalPoints / row.nQuinipolosParticipated
        : 0, // Handle cases where nQuinipolosParticipated is 0
    }))
    .sort((a, b) => b.averagePoints - a.averagePoints); // Sort by average points

  return (
    <TableContainer
      sx={{
        borderRadius: "0 0 10px 10px ",
      }}
      component={Paper}
    >
      <Table
        sx={{
          maxHeight: "50vh",
        }}
        aria-label="simple table"
      >
        <TableHead>
          <TableRow>
            <TableCell>Usuario</TableCell>
            <TableCell align="right">Promedio de Puntos</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedResults.map((row: Result, i: number) => {
            let position;
            if (
              i === 0 ||
              sortedResults[i].averagePoints === sortedResults[0].averagePoints
            ) {
              position = "🥇";
            } else if (
              i === 1 ||
              sortedResults[i].averagePoints === sortedResults[1].averagePoints
            ) {
              position = "🥈";
            } else if (
              i === 2 ||
              sortedResults[i].averagePoints === sortedResults[2].averagePoints
            ) {
              position = "🥉";
            } else {
              position =
                sortedResults.findIndex(
                  (element: Result) =>
                    element.averagePoints === row.averagePoints
                ) + 1;
            }
            return (
              <TableRow
                key={`${row.username}-${row.averagePoints}`}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {position}. {row.username} ({row.nQuinipolosParticipated})
                </TableCell>
                <TableCell align="right">
                  {row.averagePoints!.toFixed(2)}{" "}
                  {/* Display average points rounded to 2 decimals */}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Stats;
