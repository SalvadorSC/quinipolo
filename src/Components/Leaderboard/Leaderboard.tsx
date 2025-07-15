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
import { Result } from "../../Routes/CorrectionSuccess/CorrectionSuccess";
import style from "./Leaderboard.module.scss";
import { useTranslation } from 'react-i18next';

const Leaderboard = ({ sortedResults }: { sortedResults: Result[] }) => {
  const { t } = useTranslation();

  console.log('Leaderboard received sortedResults:', sortedResults);

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
            <TableCell>{t('user')}</TableCell>
            <TableCell align="right">{t('points')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedResults.map((row: Result, i: number) => {
            let position;
            if (
              i === 0 ||
              sortedResults[i].totalPoints === sortedResults[0].totalPoints
            ) {
              position = "🥇";
            } else if (
              i === 1 ||
              sortedResults[i].totalPoints === sortedResults[1].totalPoints
            ) {
              position = "🥈";
            } else if (
              i === 2 ||
              sortedResults[i].totalPoints === sortedResults[2].totalPoints
            ) {
              position = "🥉";
            } else {
              position =
                sortedResults.findIndex(
                  (element: Result) => element.totalPoints === row.totalPoints
                ) + 1;
            }
            return (
              <TableRow
                key={`${row.username}-${row.totalPoints}`}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {position}. {row.username}
                </TableCell>
                <TableCell align="right" className={style.pointsCell}>
                  {row.totalPoints}{" "}
                  {row.pointsEarned !== undefined ? (
                    <span
                      className={
                        row.correct15thGame && row.pointsEarned === 15
                          ? style.correct15
                          : ""
                      }
                    >
                      (+{row.pointsEarned})
                    </span>
                  ) : null}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default React.memo(Leaderboard);
