import {
  AppBar,
  Checkbox,
  FormControlLabel,
  IconButton,
  Link,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { FC, useContext } from "react";
import { UIContext } from "../../context/ui";
import { grey } from "@mui/material/colors";
import { useRouter } from "next/router";

export const Navbar: FC = () => {
  const { openSideMenu, showNSFW, toggleNSFW } = useContext(UIContext);

  const router = useRouter();

  return (
    <AppBar position="sticky">
      <Toolbar>
        <IconButton size="large" edge="start" onClick={openSideMenu}>
          <MenuIcon />
        </IconButton>
        <Link
          href="/"
          sx={{ textDecoration: "none", flex: 1 }}
          color={grey[100]}
        >
          <Typography sx={{ marginLeft: 3 }} variant="h4">
            Mangaloide
          </Typography>
        </Link>
        {router.asPath === "/" ? (
          <FormControlLabel
            control={<Checkbox value={showNSFW} onChange={toggleNSFW} />}
            label={"Show NSFW"}
          />
        ) : (
          ""
        )}
      </Toolbar>
    </AppBar>
  );
};
