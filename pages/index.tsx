import type { GetServerSidePropsContext, NextPage } from "next";
import { MainLayout } from "../layouts";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { darkTheme } from "../themes";
import { useRouter } from "next/router";
import { Comic, Tag } from "../interfaces";
import {
  Button,
  Card,
  CardActionArea,
  CardHeader,
  CardMedia,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { ComicModel, UserModel } from "../models";
import { db } from "../database";
import { ChangeEvent, useState } from "react";
import { comicsApi } from "../apis";
import { IComic } from "../models/Comic";
import { JWT } from "../utils";
import { ComicList } from "../components";

interface Props {
  newComics: Comic[];
  loggedIn: boolean;
}

const Home: NextPage<Props> = ({ newComics, loggedIn }) => {
  const router = useRouter();

  const [displayComics, setDisplayComics] = useState([...newComics]);

  const [selectedTag, setSelectedTag] = useState("");
  const [searchText, setSearchText] = useState("");

  const changeSelectedTag = (event: SelectChangeEvent) => {
    setSelectedTag(event.target.value);
  };

  const onSearchTextChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const filter = async () => {
    try {
      const { data } = await comicsApi.post<IComic[]>("/comic/search", {
        tag: selectedTag,
        searchText,
      });

      setDisplayComics([...data]);
    } catch (error) {
      console.log(error);
    }
  };

  const clearFilter = async () => {
    setSelectedTag("");
    setSearchText("");

    const { data } = await comicsApi.post<IComic[]>("/comic/search");

    setDisplayComics([...data]);
  };

  return (
    <MainLayout title="Mangaloide - Home">
      <Grid container justifyContent="center" spacing={2}>
        <Grid item xs={12} md={4} lg={2}>
          <TextField
            label="Text to search"
            variant="outlined"
            fullWidth
            sx={{ my: 2 }}
            value={searchText}
            onChange={onSearchTextChanged}
          />
          <FormControl fullWidth>
            <InputLabel id="tags">Tags</InputLabel>
            <Select
              labelId="tags"
              id="tagsSelect"
              value={selectedTag}
              label="Tags"
              onChange={changeSelectedTag}
            >
              {Object.keys(Tag).map((tag) => (
                <MenuItem value={tag} key={tag}>
                  {tag}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Grid container spacing={2} justifyContent="space-between">
            <Grid item xs={4}>
              <Button onClick={filter}>Filter</Button>
            </Grid>
            <Grid item xs={4}>
              <Button onClick={clearFilter}>Clear</Button>
            </Grid>
          </Grid>
        </Grid>
        <ComicList comics={displayComics} />
      </Grid>

      {loggedIn ? (
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: "fixed",
            bottom: darkTheme.spacing(2),
            right: darkTheme.spacing(2),
          }}
          href="/comic/add"
        >
          <AddIcon />
        </Fab>
      ) : (
        ""
      )}
    </MainLayout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  await db.connect();

  const { nsfw, token } = context.req.cookies;

  let loggedIn = false;

  try {
    const userId = await JWT.isValidToken(token);
    const user = await UserModel.findById(userId).select("_id").lean();
    if (user) {
      loggedIn = true;
    }
  } catch (error) {
    console.log(error);
  }

  let comics: Comic[];

  if (nsfw && nsfw === "true") {
    comics = await ComicModel.find().sort("-date").limit(20);
  } else {
    comics = await ComicModel.find({ nsfw: false }).sort("-date").limit(20);
  }

  return {
    props: {
      newComics: JSON.parse(JSON.stringify(comics)),
      loggedIn,
    },
  };
}

export default Home;
