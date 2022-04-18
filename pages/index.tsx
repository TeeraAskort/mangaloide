import type { GetServerSidePropsContext, NextPage } from "next";
import { MainLayout } from "../layouts";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { darkTheme } from "../themes";
import { useRouter } from "next/router";
import { Comic } from "../interfaces";
import {
  Card,
  CardActionArea,
  CardHeader,
  CardMedia,
  Grid,
} from "@mui/material";
import { ComicModel } from "../models";
import { db } from "../database";

interface Props {
  newComics: Comic[];
}

const Home: NextPage<Props> = ({ newComics }) => {
  const router = useRouter();

  const goToComicAdd = () => {
    router.push("/comic/add");
  };

  return (
    <MainLayout title="Mangaloide - Home">
      {newComics.length !== 0 ? (
        <Grid container justifyContent="center" spacing={2}>
          {newComics.map((comic) => (
            <Grid item xs={12} sm={6} md={4} xl={2} key={comic._id}>
              <Card>
                <CardActionArea href={`/comic/${comic._id}`}>
                  <CardMedia
                    component={"img"}
                    image={`/api/comic/${comic._id}/image`}
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
  const { nsfw } = context.req.cookies;

  console.log(nsfw);

  await db.connect();

  let comics: Comic[];

  if (nsfw === "true") {
    comics = await ComicModel.find().limit(20);
  } else {
    comics = await ComicModel.find({ nsfw: false }).limit(20);
  }

  return {
    props: {
      newComics: JSON.parse(JSON.stringify(comics)),
    },
  };
}

export default Home;
