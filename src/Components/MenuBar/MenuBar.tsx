import React, { useEffect } from "react";
import { styled } from "@mui/material/styles";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { Outlet, useNavigate } from "react-router-dom";
import logoBlack from "../../assets/LOGOS/QUINIPOLO_BLACK.svg";
import { UserButton, useUser } from "@clerk/clerk-react";
import { checkUser } from "../../utils/checkUser";
import { useUser as useUserData } from "../../Context/UserContext/UserContext";
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

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export const MenuBar = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { updateUser: updateUserData } = useUserData();

  useEffect(() => {
    console.log("aaa");
    const fetchData = async () => {
      const isaUserRegistered = await checkUser({
        email: user?.primaryEmailAddress?.emailAddress ?? "",
        username: user?.username ?? "",
        fullName: user?.fullName ?? "",
        participateGlobalQuinipolo: true,
      });

      updateUserData({ isRegistered: isaUserRegistered });
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <AppBar position="fixed">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            justifyContent: "center",
            flexDirection: "row",
          }}
        >
          <img
            src={logoBlack}
            style={{ height: 40, margin: "0px 48px", paddingTop: 4 }}
            alt="Quinipolo Logo"
            onClick={() => navigate("/")}
          />
        </div>
        <div
          style={{
            position: "absolute",
            right: 20,
            height: 40,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <UserButton />
        </div>
      </AppBar>
      <Outlet />
    </>
  );
};

export default MenuBar;
