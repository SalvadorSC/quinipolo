import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { Outlet, useNavigate } from "react-router-dom";
import logoNew from "../../assets/LOGOS/QUINIPOLO_NEW_LOGO.svg";
import { UserButton, useUser } from "@clerk/clerk-react";
import { checkUser } from "../../utils/checkUser";
import {
  UserDataType,
  useUser as useUserData,
} from "../../Context/UserContext/UserContext";
import {
  Alert,
  Box,
  Button,
  Collapse,
  Container,
  Drawer,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { apiGet } from "../../utils/apiUtils";
import AdSense from "../Adsense/Adsense";
import styles from "./MenuBar.module.scss";
const drawerWidth = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

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

export const MenuBar = () => {
  const navigate = useNavigate();
  const { user, isSignedIn } = useUser();
  const { updateUser: updateUserData } = useUserData();
  const [showAlert, setShowAlert] = useState(true);
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
          userId: user.id,
        });
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [open, setOpen] = useState(false);
  const logoStyle = {
    width: "140px",
    height: "auto",
    marginLeft: "15px",
    cursor: "pointer",
  };
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

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
              bgcolor: "rgba(255, 255, 255)",
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
              <Box sx={{ display: { xs: "none", md: "flex" } }}>
                <UserButton showName />
              </Box>
            </Box>

            <Box sx={{ display: { sm: "", md: "none" } }}>
              <Button
                variant="text"
                color="primary"
                aria-label="menu"
                onClick={toggleDrawer(true)}
                sx={{ minWidth: "30px", p: "4px" }}
              >
                <MenuIcon />
              </Button>
              <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
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
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <UserButton showName />
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
          <Collapse in={showAlert}>
            <Alert
              icon={false}
              severity="warning"
              onClose={() => setShowAlert(false)}
              sx={{ textAlign: "left", display: "flex", alignItems: "center" }}
            >
              <div className={styles.proPlanAlertActions}>
                <Typography variant="body2" sx={{ mr: 2 }}>
                  Hazte PRO de Quinipolo para <b>quitar los anuncios</b>, tener
                  análisis y disfrutar de más ligas!
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    setShowAlert(false);
                    navigate("pro-plan");
                  }}
                >
                  Unirse
                </Button>
              </div>
            </Alert>
          </Collapse>
          <Outlet />
          {/* Place the AdSense component wherever you want the ad to appear */}
          <AdSense
            client="pub-9824707177635245"
            slot="5958237091"
            style={{ display: "block", textAlign: "center" }}
            format="auto"
            responsive="true"
          />
        </Container>
      ) : null}
    </>
  );
};

export default MenuBar;
