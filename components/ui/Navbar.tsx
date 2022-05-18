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
import { ChangeEvent, FC, useContext, useEffect, useState } from "react";
import { UIContext } from "../../context/ui";
import { grey } from "@mui/material/colors";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

export const Navbar: FC = () => {
  const router = useRouter();

  const { openSideMenu } = useContext(UIContext);

  const [showNSFW, setShowNSFW] = useState<boolean>(false);
  const [strip, setStrip] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowNSFW(Cookies.get("nsfw") === "true");
    }, 200);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setStrip(Cookies.get("strip") === "true");
    }, 200);
  });

  const onChangeNSFW = (event: ChangeEvent, checked: boolean) => {
    setShowNSFW(checked);
    Cookies.set("nsfw", JSON.stringify(checked));
    setTimeout(() => {
      router.reload();
    }, 300);
  };

  const changePagination = (event: ChangeEvent, checked: boolean) => {
    setStrip(checked);
    Cookies.set("strip", JSON.stringify(checked));
    const { comicId, chId } = router.query;
    if (router.pathname.includes("/page/[pgNum]")) {
      router.replace(`/comic/${comicId}/chapter/${chId}`);
    } else {
      router.replace(`/comic/${comicId}/chapter/${chId}/page/1`);
    }
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
            control={<Checkbox checked={showNSFW} onChange={onChangeNSFW} />}
            label={"Show NSFW"}
          />
        ) : (
          ""
        )}

        {router.pathname.includes("/comic/[comicId]/chapter/[chId]") ? (
          <FormControlLabel
            control={<Checkbox checked={strip} onChange={changePagination} />}
            label="Continuous strip"
          />
        ) : (
          ""
        )}
      </Toolbar>
    </AppBar>
  );
};
