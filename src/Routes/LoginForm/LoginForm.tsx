import React from "react";
import styles from "./LoginForm.module.scss";
import { SignUp } from "@clerk/clerk-react";
import MenuBar from "../../Components/MenuBar/MenuBar";

const LoginForm = () => {
  return (
    <div className={styles.loginContainer}>
      <MenuBar />
      <SignUp />
    </div>
  );
};

export default LoginForm;
