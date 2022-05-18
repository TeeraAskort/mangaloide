import { MainLayout } from "../../layouts";
import { GetServerSideProps } from "next";
import { JWT } from "../../utils";
import { comicsApi } from "../../apis";
import UserModel, { IUser } from "../../models/User";
import {
  Button,
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  Grid,
  Chip,
  IconButton,
} from "@mui/material";
import { Error } from "@mui/icons-material";

import { ChangeEvent, FC, useState } from "react";
import { useRouter } from "next/router";
import axios, { AxiosError } from "axios";

interface Props {
  user: IUser;
}

interface ImageUploadResponse {
  message?: string;
  ok?: boolean;
}

const ProfilePage: FC<Props> = ({ user }) => {
  const router = useRouter();

  const [image, setImage] = useState<File | null | undefined>(null);

  const [imageUploadError, setImageUploadError] = useState("");
  const [showImageUploadError, setShowImageUploadError] = useState(false);

  const onImageChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setImage(event.target.files?.item(0));
  };

  const changeImage = async () => {
    if (!image) return;

    setShowImageUploadError(false);

    try {
      const bodyFormData = new FormData();
      bodyFormData.append("file", image);

      const { data } = await comicsApi.post<ImageUploadResponse>(
        `/user/image/${user._id}/changeimage`,
        bodyFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.ok) {
        router.reload();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<ImageUploadResponse>;
        setImageUploadError(err.response?.data.message!);
        setShowImageUploadError(true);
      }
    }
  };

  return (
    <MainLayout title="Profile">
      <Grid container spacing={2} justifyContent="space-between">
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <Chip
              label={imageUploadError}
              color="error"
              icon={<Error />}
              sx={{ display: showImageUploadError ? "flex" : "none" }}
            />
            <CardHeader title="Profile picture" />
            <CardMedia
              component="img"
              image={`/api/user/image/${user._id}`}
              alt={`${user.username} profile picture`}
            />
            <CardActions>
              <Button variant="contained" component="label">
                Upload image
                <input
                  type={"file"}
                  hidden
                  onChange={onImageChanged}
                  accept="image/jpeg, image/png, image/gif"
                />
              </Button>

              <Button variant="contained" onClick={changeImage}>
                Change image
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { token } = ctx.req.cookies;

  let userId;

  try {
    userId = JWT.isValidToken(token);
  } catch (error) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }

  const user = await UserModel.findById(userId)
    .select("_id username email")
    .lean();

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
      user,
    },
  };
};

export default ProfilePage;
