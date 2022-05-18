import {
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Fab,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { GetServerSidePropsContext } from "next";
import { MainLayout } from "../../../layouts";
import { ComicModel } from "../../../models";
import { Comic } from "../../../interfaces";
import { FC } from "react";
import { useRouter } from "next/router";
import { darkTheme } from "../../../themes";
import AddIcon from "@mui/icons-material/Add";
import { db } from "../../../database";
import Cookies from "js-cookie";

interface Props {
  comic: Comic;
}

const ComicDetailPage: FC<Props> = ({ comic }) => {
  const router = useRouter();

  const goToChapterAdd = () => {
    router.push(`/comic/${comic._id}/chapter/add`);
  };

  const goToChapter = (comicId: string, chapterId: string) => {
    if (Cookies.get("strip")) {
      const strip = Boolean(Cookies.get("strip"));
      if (strip) {
        router.push(`/comic/${comicId}/chapter/${chapterId}`);
      } else {
        router.push(`/comic/${comicId}/chapter/${chapterId}/page/1`);
      }
    } else {
      router.push(`/comic/${comicId}/chapter/${chapterId}/page/1`);
    }
  };

  return (
    <MainLayout title={comic.name}>
      <Grid container spacing={2} justifyContent="space-around">
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardMedia
              component={"img"}
              image={`/api/comic/${comic._id}/image`}
              alt={comic.name}
            />
            <CardHeader title={comic.name} />
            <CardContent>
              <Typography variant="h6">Author: {comic.author}</Typography>
              <Typography variant="body1" sx={{ marginY: 2 }}>
                Sinopsis: <br /> {comic.description}
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ marginY: 3 }}>
            <CardHeader title="Chapters" />
            {comic.chapters.length === 0 ? (
              <CardContent>
                <Typography variant="body1">No chapters</Typography>
              </CardContent>
            ) : (
              <CardContent>
                <List>
                  {comic.chapters.map((chapter) => (
                    <ListItemButton
                      component="a"
                      onClick={() => goToChapter(comic._id, chapter._id!)}
                      key={chapter.chNumber}
                    >
                      <ListItemText
                        primary={`${chapter.chNumber} - ${
                          chapter.name !== "" ? chapter.name : "No chapter name"
                        } - ${chapter.language}`}
                      />
                    </ListItemButton>
                  ))}
                </List>
              </CardContent>
            )}
          </Card>
        </Grid>
      </Grid>

      <Fab
        onClick={goToChapterAdd}
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

  const { comicId } = context.params!;

  const comic = await ComicModel.findById(comicId);

  if (!comic) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      comic: JSON.parse(JSON.stringify(comic)),
    },
  };
}

export default ComicDetailPage;
