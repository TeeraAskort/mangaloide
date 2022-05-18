import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { useContext } from "react";
import { UIContext } from "../../context/ui";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import HomeIcon from "@mui/icons-material/Home";
import { useRouter } from "next/router";
import { AuthContext } from "../../context/auth";

export const Sidebar = () => {
  const { sidemenuOpen, closeSideMenu } = useContext(UIContext);

  const { logout, isLoggedIn } = useContext(AuthContext);

  const router = useRouter();

  const go = (place: string) => {
    router.push(place);
    closeSideMenu();
  };

  const doLogout = () => {
    logout();

    closeSideMenu();

    if (router.pathname.includes("/user/profile")) {
      router.push("/");
    } else {
      router.reload();
    }
  };

  return (
    <Drawer anchor="left" open={sidemenuOpen} onClose={closeSideMenu}>
      <Box sx={{ width: 250 }}>
        <Box sx={{ padding: "5px 10px" }}>
          <Typography variant="h4">Menu</Typography>
        </Box>
        <List>
          {!isLoggedIn ? (
            <ListItem button onClick={() => go("/auth/login")}>
              <ListItemIcon>
                <LoginIcon />
              </ListItemIcon>
              <ListItemText primary="Log in" />
            </ListItem>
          ) : (
            ""
          )}
          {isLoggedIn ? (
            <ListItem button onClick={doLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Log out" />
            </ListItem>
          ) : (
            ""
          )}
          {!isLoggedIn ? (
            <ListItem button onClick={() => go("/auth/register")}>
              <ListItemIcon>
                <HowToRegIcon />
              </ListItemIcon>
              <ListItemText primary="Register" />
            </ListItem>
          ) : (
            ""
          )}
        </List>
        <Divider />
        <List>
          <ListItem button onClick={() => go("/")}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};
