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
import Cookies from "js-cookie";
import { GetServerSideProps } from "next";

interface Props {
  nsfw: boolean;
}

export const Navbar: FC<Props> = ({ nsfw }) => {
  const { openSideMenu, toggleNSFW } = useContext(UIContext);

  const router = useRouter();

  let showNSFW: boolean = nsfw;

  const onChangeNSFW = () => {
    toggleNSFW();
    showNSFW = !showNSFW;
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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { nsfw } = await ctx.req.cookies; // your fetch function here

  return {
    props: {
      nsfw: nsfw === "true" ? true : false,
    },
  };
};
