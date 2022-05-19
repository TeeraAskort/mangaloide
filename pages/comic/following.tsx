import { GetServerSideProps } from "next";
import {
  Card,
  CardActionArea,
  CardHeader,
  CardMedia,
  Grid,
} from "@mui/material";
import { FC } from "react";
import { ComicMin } from "../../interfaces";
import { MainLayout } from "../../layouts";
import { JWT } from "../../utils";
import { db } from "../../database";
import UserModel from "../../models/User";

interface Props {
  comicsFollowing: ComicMin[];
}

const FollowingPage: FC<Props> = ({ comicsFollowing }) => {
  return (
    <MainLayout title="Comics following">
      <Grid container spacing={2} justifyContent="center">
        {comicsFollowing.map((comic) => (
          <Grid item key={comic._id} xs={12} sm={6} md={3}>
            <Card>
              <CardActionArea href={`/comic/${comic._id}`}>
                <CardMedia
                  component="img"
                  image={`/api/comic/get/${comic._id}/image`}
                  alt={comic.name}
                />
                <CardHeader title={comic.name} />
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { token } = ctx.req.cookies;

  let userId;
  try {
    userId = await JWT.isValidToken(token);
  } catch (error) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }

  await db.connect();

  const user = await UserModel.findById(userId).select("-_id comicsFollowing");

  if (!user) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      comicsFollowing: JSON.parse(JSON.stringify(user.comicsFollowing)),
    },
  };
};

export default FollowingPage;
