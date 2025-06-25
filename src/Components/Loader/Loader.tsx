import { CircularProgress } from "@mui/material";
import React from "react";
import style from "./Loader.module.scss";
import { useTranslation } from 'react-i18next';

const Loader = () => {
  const { t } = useTranslation();
  return (
    <div className={style.loadingPage}>
      <p className={style.loadingMessage}>{t('loading')}</p>
      <CircularProgress />
    </div>
  );
};

export default Loader;
