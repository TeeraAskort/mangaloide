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
import { ComicModel } from "../models";
import { db } from "../database";
import { ChangeEvent, useState } from "react";
import { comicsApi } from "../apis";
import { IComic } from "../models/Comic";

interface Props {
  newComics: Comic[];
}

const Home: NextPage<Props> = ({ newComics }) => {
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

  const goToComicAdd = () => {
    router.push("/comic/add");
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

          <Button onClick={filter}>Filter</Button>
        </Grid>
        <Grid item xs={12} md={8} lg={10}>
          {displayComics.length !== 0 ? (
            <Grid container justifyContent="center" spacing={2}>
              {displayComics.map((comic) => (
                <Grid item xs={12} sm={6} md={4} xl={2} key={comic._id}>
                  <Card sx={{ border: comic.nsfw ? "1px solid red" : "" }}>
                    <CardActionArea href={`/comic/${comic._id}`}>
                      <CardMedia
                        component={"img"}
                        image={`/api/comic/get/${comic._id}/image`}
                        alt={comic.name}
                      />
                      <CardHeader title={comic.name} />
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Grid container justifyContent="center" spacing={2}>
              <Grid item xs={12} sm={6} md={4} xl={2}>
                <Card>
                  <CardHeader title="There are no comics" />
                </Card>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>

      <Fab
        onClick={goToComicAdd}
        color="primary"
        aria-label="add"
        sx={{
          position: "fixed",
          bottom: darkTheme.spacing(2),
          right: darkTheme.spacing(2),
        }}
      >
        <AddIcon />
      </Fab>
    </MainLayout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  await db.connect();

  const { nsfw } = context.req.cookies;

  let comics: Comic[];

  if (nsfw && nsfw === "true") {
    comics = await ComicModel.find().sort("-date").limit(20);
  } else {
    comics = await ComicModel.find({ nsfw: false }).sort("-date").limit(20);
  }

  return {
    props: {
      newComics: JSON.parse(JSON.stringify(comics)),
    },
  };
}

export default Home;
