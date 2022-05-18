import {
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Fab,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { GetServerSidePropsContext } from "next";
import { MainLayout } from "../../../layouts";
import { ComicModel } from "../../../models";
import { ChapterMin, Comic, ComicMin } from "../../../interfaces";
import { FC, useContext } from "react";
import { useRouter } from "next/router";
import { darkTheme } from "../../../themes";
import AddIcon from "@mui/icons-material/Add";
import { db } from "../../../database";
import Cookies from "js-cookie";
import { JWT } from "../../../utils";
import { AuthContext } from "../../../context/auth";
import { Visibility, VisibilityOutlined } from "@mui/icons-material";
import { comicsApi } from "../../../apis";

interface Props {
  comic: Comic;
  isLoggedIn: boolean;
}

interface SetAsSeenResponse {
  message?: string;
  comicsFollowing?: ComicMin[];
}

const ComicDetailPage: FC<Props> = ({ comic, isLoggedIn }) => {
  const router = useRouter();

  const { user, updateUser } = useContext(AuthContext);

  let chapters: ChapterMin[] = [];
  if (user) {
    chapters =
      user.comicsFollowing.find((following) => following._id === comic._id)
        ?.chaptersRead || [];
  }

  const goToChapterAdd = () => {
    router.push(`/comic/${comic._id}/chapter/add`);
  };

  const goToChapter = (comicId: string, chapterId: string) => {
    if (Cookies.get("strip")) {
      if (Cookies.get("strip") === "true") {
        router.push(`/comic/${comicId}/chapter/${chapterId}`);
      } else {
        router.push(`/comic/${comicId}/chapter/${chapterId}/page/1`);
      }
    } else {
      router.push(`/comic/${comicId}/chapter/${chapterId}/page/1`);
    }
  };

  const setAsSeen = async (chId: string) => {
    if (!user) return;

    if (chapters.find((chapter) => chapter._id === chId)) {
      const { data } = await comicsApi.get<SetAsSeenResponse>(
        `/comic/get/${comic._id}/chapter/${chId}/unset-as-seen`
      );
      if (data.comicsFollowing) {
        user.comicsFollowing = data.comicsFollowing;
        updateUser(user);
      }
    } else {
      const { data } = await comicsApi.get<SetAsSeenResponse>(
        `/comic/get/${comic._id}/chapter/${chId}/set-as-seen`
      );
      if (data.comicsFollowing) {
        user.comicsFollowing = data.comicsFollowing;
        updateUser(user);
      }
    }
  };

  return (
    <MainLayout title={comic.name}>
      <Grid container spacing={2} justifyContent="space-around">
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardMedia
              component={"img"}
              image={`/api/comic/get/${comic._id}/image`}
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
                    <ListItem
                      key={chapter.chNumber}
                      secondaryAction={
                        user ? (
                          <IconButton
                            edge="end"
                            aria-label="seen"
                            onClick={() => setAsSeen(chapter._id!)}
                          >
                            {chapters.find((ch) => ch._id === chapter._id) ? (
                              <Visibility />
                            ) : (
                              <VisibilityOutlined />
                            )}
                          </IconButton>
                        ) : (
                          ""
                        )
                      }
                    >
                      <ListItemButton
                        component="a"
                        onClick={() => goToChapter(comic._id, chapter._id!)}
                      >
                        <ListItemText
                          primary={`${chapter.chNumber} - ${
                            chapter.name !== ""
                              ? chapter.name
                              : "No chapter name"
                          } - ${chapter.language}`}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            )}
          </Card>
        </Grid>
      </Grid>

      {isLoggedIn ? (
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
      ) : (
        ""
      )}
    </MainLayout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  await db.connect();

  const { comicId } = context.params!;

  const { token } = context.req.cookies;

  let isLoggedIn = false;

  try {
    await JWT.isValidToken(token);
    isLoggedIn = true;
  } catch (error) {
    isLoggedIn = false;
  }

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
      isLoggedIn,
    },
  };
}

export default ComicDetailPage;
