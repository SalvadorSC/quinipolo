import React from "react";
import styles from "./LoginForm.module.scss";
import { SignIn } from "@clerk/clerk-react";
import MenuBar from "../../Components/MenuBar/MenuBar";
import { useTheme } from "../../Context/ThemeContext/ThemeContext";
import { dark } from "@clerk/themes";
import { useTranslation } from 'react-i18next';

const LoginForm = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  return (
    <>
      <MenuBar />
      <div className={styles.signUpWrapper}>
        <SignIn
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
