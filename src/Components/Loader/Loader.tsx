import { CircularProgress } from "@mui/material";
import React from "react";
import style from "./Loader.module.scss";

const Loader = () => {
  return (
    <div className={style.loadingPage}>
      <p className={style.loadingMessage}>Loading...</p>
      <CircularProgress />
    </div>
  );
};

export default Loader;
