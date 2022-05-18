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
  CardContent,
  TextField,
  Typography,
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

  const [lastPassword, setLastPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordRepeat, setNewPasswordRepeat] = useState("");

  const [changePasswordMessage, setChangePasswordMessage] = useState("");
  const [changePasswordMessageShow, setChangePasswordMessageShow] =
    useState(false);
  const [changePasswordMessageColor, setChangePasswordMessageColor] = useState<
    "success" | "error"
  >("success");

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

  const onLastPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLastPassword(event.target.value);
  };

  const onNewPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewPassword(event.target.value);
  };

  const onNewPasswordRepeatChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewPasswordRepeat(event.target.value);
  };

  const changePassword = async () => {
    if (!lastPassword || !newPassword || !newPasswordRepeat) {
      return;
    }

    setChangePasswordMessageShow(false);

    try {
      const { data } = await comicsApi.post<ImageUploadResponse>(
        `/user/modify/${user._id}/change-password`,
        { lastPassword, newPassword, newPasswordRepeat },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (data.ok) {
        setChangePasswordMessage("Password changed");
        setChangePasswordMessageShow(true);
        setChangePasswordMessageColor("success");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<ImageUploadResponse>;
        setChangePasswordMessage(err.response?.data.message!);
        setChangePasswordMessageColor("error");
        setChangePasswordMessageShow(true);
      }
    }
  };

  return (
    <MainLayout title="Profile">
      <Grid container spacing={2} justifyContent="space-between">
        <Grid item xs={12} md={5} lg={3}>
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
              image={`/api/user/image/${user._id}/image`}
              alt={`${user.username} profile picture`}
            />
            <CardActions>
              <Grid container spacing={2} justifyContent="space-between">
                <Grid item>
                  <Button variant="contained" component="label">
                    Select image
                    <input
                      type={"file"}
                      hidden
                      onChange={onImageChanged}
                      accept="image/jpeg, image/png, image/gif"
                    />
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    sx={{ marginLeft: 2 }}
                    variant="contained"
                    onClick={changeImage}
                  >
                    Change image
                  </Button>
                </Grid>
              </Grid>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} md={7} lg={9}>
          <Card>
            <CardHeader title={user.username} />
            <CardContent>
              <Typography variant="h4" component="h4">
                Change password
              </Typography>
              <Grid container spacing={2} justifyContent="space-between">
                <Grid item xs={12}>
                  <Chip
                    label={changePasswordMessage}
                    color={changePasswordMessageColor}
                    sx={{
                      display: changePasswordMessageShow ? "flex" : "none",
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Old password"
                    variant="outlined"
                    fullWidth
                    value={lastPassword}
                    onChange={onLastPasswordChange}
                    type="password"
                    sx={{ marginY: 2 }}
                  />
                </Grid>
                <Grid item container xs={12} md={6}>
                  <Grid item xs={12}>
                    <TextField
                      label="New password"
                      variant="outlined"
                      fullWidth
                      value={newPassword}
                      onChange={onNewPasswordChange}
                      type="password"
                      sx={{ marginY: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Repeat new password"
                      variant="outlined"
                      fullWidth
                      value={newPasswordRepeat}
                      onChange={onNewPasswordRepeatChange}
                      type="password"
                      sx={{ marginY: 2 }}
                    />
                  </Grid>
                </Grid>
                <Grid item xs={6} justifyItems="flex-end">
                  <Button variant="contained" onClick={changePassword}>
                    Change password
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
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
    userId = await JWT.isValidToken(token);
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
      user: JSON.parse(JSON.stringify(user)),
    },
  };
};

export default ProfilePage;
