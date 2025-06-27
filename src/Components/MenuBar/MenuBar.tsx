import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import logoNew from "../../assets/LOGOS/QUINIPOLO_NEW_LOGO.svg";
import { UserButton, useUser } from "@clerk/clerk-react";
import { checkUser } from "../../utils/checkUser";
import {
  UserDataType,
  useUser as useUserData,
} from "../../Context/UserContext/UserContext";
import {
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  Toolbar,
  useMediaQuery,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Select } from "antd";
import MenuIcon from "@mui/icons-material/Menu";
import { apiGet } from "../../utils/apiUtils";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useTheme } from "../../Context/ThemeContext/ThemeContext";
import { dark } from "@clerk/themes";
import { useTranslation } from "react-i18next";

const drawerWidth = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const customerPortalLink =
  process.env.REACT_APP_ENV === "development"
    ? "https://billing.stripe.com/p/login/test_14kbLs7HL4fE8mI4gg"
    : process.env.REACT_APP_CUSTOMER_PORTAL_LINK;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: drawerWidth,
  }),
}));

const LANGUAGES = [
  { value: "en", label: "EN" },
  { value: "es", label: "ES" },
  { value: "ca", label: "CA" },
  { value: "fr", label: "FR" },
  { value: "de", label: "DE" },
  { value: "it", label: "IT" },
  { value: "pt", label: "PT" },
  { value: "ja", label: "JA" },
  { value: "zh", label: "ZH" },
];

export const MenuBar = () => {
  const navigate = useNavigate();
  const { user, isSignedIn } = useUser();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const { updateUser: updateUserData, userData } = useUserData();
  const [open, setOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const isMobile = useMediaQuery("(max-width:600px)");

  const getUserData = async (user: any) => {
    const data = await apiGet<UserDataType>(
      `/api/users/user/data/${user.username}`
    );
    updateUserData({
      role: data.role,
      leagues: data.leagues,
      quinipolosToAnswer: data.quinipolosToAnswer,
      moderatedLeagues: data.moderatedLeagues,
      username: user?.username,
      emailAddress: user.primaryEmailAddress?.emailAddress,
      userId: data.userId,
      hasBeenChecked: true,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      if (
        user?.primaryEmailAddress?.emailAddress &&
        user?.username &&
        user?.fullName
      ) {
        const isaUserRegistered = await checkUser({
          email: user.primaryEmailAddress?.emailAddress,
          username: user.username,
          fullName: user.fullName,
          participateGlobalQuinipolo: true,
        });
        updateUserData({ isRegistered: isaUserRegistered });
        getUserData(user);
      }
    };
    // if path is dashboard
    if (!userData.hasBeenChecked || location.pathname === "/dashboard") {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const logoStyle = {
    width: "140px",
    height: "auto",
    marginLeft: "15px",
    cursor: "pointer",
  };
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const subscribeButton = () => {
    return (
      <>
        {isSignedIn &&
        userData.emailAddress === "sanchezcampossalvador@gmail.com" &&
        userData.stripeCustomerId !== undefined ? (
          <a
            href={
              customerPortalLink + "?prefilled_email=" + userData.emailAddress
            }
          >
            <Button sx={{ mt: 4 }} variant="contained" color="primary">
              Gestionar Suscripción
            </Button>
          </a>
        ) : isSignedIn &&
          userData.emailAddress === "sanchezcampossalvador@gmail.com" ? (
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/subscribe")}
          >
            {t('subscribe')}
          </Button>
        ) : null}
      </>
    );
  };

  // Language picker component
  const LanguagePicker = ({ inDrawer = false }) => (
    <Select
      value={i18n.language}
      onChange={(value) => i18n.changeLanguage(value)}
      options={LANGUAGES}
      size={inDrawer ? "large" : "small"}
      style={{
        minWidth: 60,
        fontSize: inDrawer ? 18 : 12,
        marginLeft: inDrawer ? 0 : 8,
        marginRight: inDrawer ? 0 : 8,
        display: inDrawer ? "block" : isMobile ? "none" : "inline-block",
      }}
      getPopupContainer={trigger => document.body}
      dropdownStyle={{ zIndex: 3000 }}
    />
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          boxShadow: 0,
          bgcolor: "transparent",
          backgroundImage: "none",
          mt: 2,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            variant="regular"
            sx={() => ({
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
              borderRadius: "999px",
              bgcolor: theme === "light" ? "#f4f6fb" : "#121212",
              backgroundImage:
                theme === "light"
                  ? "none"
                  : "linear-gradient(rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.08))",
              backdropFilter: "blur(24px)",
              maxHeight: 40,
              border: "1px solid",
              borderColor: "divider",
              boxShadow: `0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`,
            })}
          >
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                ml: "-18px",
                px: 0,
              }}
            >
              <img
                src={logoNew}
                style={logoStyle}
                alt="logo of quinipolo"
                onClick={() => navigate("/dashboard")}
              />
              <Box sx={{ display: { xs: "none", lg: "flex" } }}>
                {subscribeButton()}
                <IconButton onClick={toggleTheme}>
                  {theme === "light" ? <DarkModeIcon /> : <LightModeIcon />}
                </IconButton>
                <UserButton
                  appearance={{
                    baseTheme: theme === "light" ? undefined : dark,
                  }}
                  showName
                />
                {!isMobile && (
                  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1 }}>
                    <LanguagePicker />
                  </Box>
                )}
              </Box>
            </Box>

            <Box sx={{ display: { sm: "", md: "none" } }}>
              {isSignedIn && (
                <IconButton
                  edge="end"
                  color="inherit"
                  aria-label="menu"
                  onClick={() => setOpen(true)}
                  sx={{ ml: 1 }}
                >
                  <MenuIcon sx={{ color: theme === "light" ? "black" : "white" }} />
                </IconButton>
              )}
              <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
                <Box
                  sx={{
                    minWidth: "60dvw",
                    p: 2,
                    backgroundColor: "background.paper",
                    flexGrow: 1,
                  }}
                >
                  {isSignedIn ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexDirection: "column",
                        maxWidth: "160px",
                        gap: 10,
                        margin: "0 auto",
                      }}
                    >
                     
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-around", gap: 1, p: 1, width: "100%" }}>
                        <IconButton onClick={toggleTheme}>
                          {theme === "light" ? (
                            <DarkModeIcon />
                          ) : (
                            <LightModeIcon />
                          )}
                        </IconButton>
                        <UserButton
                          appearance={{
                            baseTheme: theme === "light" ? undefined : dark,
                          }}
                        />
                      </Box>
                        {subscribeButton()} <ListItem>
                        <ListItemText primary={t("language")} />
                        <LanguagePicker inDrawer />
                      </ListItem>
                    </div>
                  ) : null}
                </Box>
              </Drawer>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      {isSignedIn ? (
        <Container
          maxWidth="lg"
          className="content"
          sx={{ mt: window.innerWidth > 400 ? "100px" : "88px" }}
        >
          <Outlet />
        </Container>
      ) : null}
    </>
  );
};

export default MenuBar;
