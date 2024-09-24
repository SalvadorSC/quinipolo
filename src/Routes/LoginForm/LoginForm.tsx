import React from "react";
import styles from "./LoginForm.module.scss";
import { SignUp } from "@clerk/clerk-react";
import MenuBar from "../../Components/MenuBar/MenuBar";
import { useTheme } from "../../Context/ThemeContext/ThemeContext";
import { dark } from "@clerk/themes";

const LoginForm = () => {
  const { theme } = useTheme();
  return (
    <>
      <MenuBar />
      <div className={styles.signUpWrapper}>
        <SignUp
          appearance={{
            layout: { showOptionalFields: false },
            baseTheme: theme === "light" ? undefined : dark,
          }}
        />
      </div>
    </>
  );
};

export default LoginForm;
