import { Button, IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import React from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import Countdown from "react-countdown";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import styles from "./QuinipoloCard.module.scss";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { apiPatch } from "../../utils/apiUtils";
import { useTheme } from "../../Context/ThemeContext/ThemeContext";
import { useTranslation } from 'react-i18next';

dayjs.extend(utc);
dayjs.extend(timezone);

interface QuinipoloCardProps {
  quinipolo: any;
  deadlineIsInPast: boolean;
  username: string;
  moderatedLeagues: string[];
}

const QuinipoloCard = ({
  quinipolo,
  deadlineIsInPast,
  username,
  moderatedLeagues,
}: QuinipoloCardProps) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const { t } = useTranslation();

  const handleDeleteQuinipolo = async () => {
    const response = await apiPatch(
      `/api/quinipolos/quinipolo/${quinipolo._id}/delete`,
      null
    );
    console.log("Quinipolo marked as deleted:", response);

    handleMenuClose();
  };

  return (
    <div
      className={`${styles.quinipoloContainer} ${
        quinipolo.isDeleted ? styles.deleted : ""
      } ${theme === "dark" ? styles.dark : ""}`}
      key={`${quinipolo.league}-${quinipolo.endDate}`}
    >
      <div className={styles.quinipoloInfo}>
        <div className={styles.quinipoloInfoHeader}>
          <div className={styles.quinipoloInfoLeft}>
            <h2>{`${quinipolo.leagueName}`}</h2>
            <h3
              className={`${styles.endDate} ${
                theme === "dark" ? styles.endDateDark : ""
              }`}
            >
              {dayjs(quinipolo.endDate).utc().format("DD/MM/YY HH:mm")}
            </h3>
          </div>
          <div className={styles.quinipoloInfoRight}>
            {quinipolo.isDeleted ? (
              <p>Eliminada</p>
            ) : (
              <>
                {!quinipolo.participantsWhoAnswered.includes(username) ? (
                  <p>Sin responder</p>
                ) : null}
                {!deadlineIsInPast ? (
                  <p
                    className={`${styles.countdown} ${
                      theme !== "light" && styles.countdownDark
                    }`}
                  >
                    {new Date(quinipolo.endDate) > new Date() && (
                      <Countdown date={quinipolo.endDate} />
                    )}
                  </p>
                ) : null}
              </>
            )}
          </div>
          {moderatedLeagues.includes(quinipolo.leagueId) &&
          !quinipolo.hasBeenCorrected &&
          !deadlineIsInPast &&
          !quinipolo.isDeleted ? (
            <>
              <IconButton
                sx={{ padding: 0, ml: 1 }}
                aria-label="more"
                id="long-button"
                size="small"
                aria-controls={open ? "long-menu" : undefined}
                aria-expanded={open ? "true" : undefined}
                aria-haspopup="true"
                onClick={handleMenuClick}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem
                  sx={{
                    fontSize: "12px",
                    padding: "2px 8px",
                  }}
                  onClick={handleDeleteQuinipolo}
                >
                  {t('deleteBtn')}
                </MenuItem>
              </Menu>
            </>
          ) : null}
        </div>

        <div className={styles.quinipoloActions}>
          {!quinipolo.participantsWhoAnswered.includes(username) && (
            <Button
              className={styles.actionButton}
              disabled={deadlineIsInPast || quinipolo.isDeleted}
              onClick={() => navigate(`/quinipolo?id=${quinipolo._id}`)}
              variant={"contained"}
            >
              <span>{t('submit')}</span>
              <PlayCircleFilledIcon />
            </Button>
          )}
          {moderatedLeagues.includes(quinipolo.leagueId) &&
            !quinipolo.hasBeenCorrected &&
            deadlineIsInPast && (
              <Tooltip
                arrow
                title={
                  !deadlineIsInPast &&
                  t('edit')
                }
              >
                <Button
                  className={`${styles.actionButton} ${styles.actionButtonCorrect} ${theme === "dark" ? styles.dark : ""}`}
                  onClick={() => {
                    navigate(
                      `/quinipolo/correct?id=${quinipolo._id}&correct=true`
                    );
                  }}
                  variant={"contained"}
                  disabled={!deadlineIsInPast || quinipolo.isDeleted}
                >
                  <span>{t('correct')}</span>
                  <EditIcon />
                </Button>
              </Tooltip>
            )}
          {quinipolo.hasBeenCorrected &&
            moderatedLeagues.includes(quinipolo.leagueId) && (
              <Button
                className={`${styles.actionButton} ${styles.actionButtonCorrect}`}
                onClick={() =>
                  navigate(`/quinipolo?id=${quinipolo._id}&correctionEdit=true`)
                }
                disabled={quinipolo.isDeleted}
                variant={"contained"}
              >
                <span>{t('edit')}</span>
                <EditIcon />
              </Button>
            )}
          {(quinipolo.hasBeenCorrected ||
            quinipolo.participantsWhoAnswered.includes(username)) ? (
            <Button
              className={`${styles.actionButton}`}
              onClick={() => {
                navigate(`/quinipolo?id=${quinipolo._id}&see=true`);
              }}
              disabled={
                quinipolo.isDeleted || quinipolo.leagueId === "sant_feliu_24_25"
              }
              variant={"contained"}
            >
              <span>{t('answers')}</span>
              <VisibilityIcon />
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default QuinipoloCard;
