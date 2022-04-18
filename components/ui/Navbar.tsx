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
import { FC, useContext, useEffect, useState } from "react";
import { UIContext } from "../../context/ui";
import { grey } from "@mui/material/colors";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

export const Navbar: FC = () => {
  const router = useRouter();

  const { openSideMenu } = useContext(UIContext);

  const [showNSFW, setShowNSFW] = useState(false);

  useEffect(() => {
    const nsfw = Cookies.get("nsfw") || false;
    setShowNSFW(Boolean(nsfw));
  }, []);

  const onChangeNSFW = () => {
    setShowNSFW(!showNSFW);
    Cookies.set("nsfw", String(showNSFW));
  };

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
            control={
              <Checkbox
                value={showNSFW}
                checked={showNSFW}
                onChange={onChangeNSFW}
              />
            }
            label={"Show NSFW"}
          />
        ) : (
          ""
        )}
      </Toolbar>
    </AppBar>
  );
};
