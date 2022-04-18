import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  TextField,
} from "@mui/material";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { ChangeEvent, SyntheticEvent, useState } from "react";
import { comicsApi } from "../../apis";
import { Comic } from "../../interfaces";
import { MainLayout } from "../../layouts";

const AddComicPage = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [nsfw, setNsfw] = useState(false);
  const [image, setImage] = useState<File | null | undefined>(null);
  const [touched, setTouched] = useState(false);

  const [error, setError] = useState("");

  const onNameChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const onAuthorChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setAuthor(event.target.value);
  };

  const onDescriptionChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };

  const onImageChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setImage(event.target.files?.item(0));
  };

  const onNSFWChanged = (event: SyntheticEvent, checked: boolean) => {
    setNsfw(checked);
  };

  const send = async () => {
    if (image && name && author && description) {
      try {
        const bodyFormData = new FormData();
        bodyFormData.append("name", name);
        bodyFormData.append("author", author);
        bodyFormData.append("description", description);
        bodyFormData.append("file", image);
        bodyFormData.append("nsfw", String(nsfw));

        const comic = await comicsApi.post<Comic>("/comic", bodyFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (comic) {
          router.push("/");
        }
      } catch (error: any) {
        setError(error);
      }
    } else {
      setError("You have to enter all data");
    }
  };

  return (
    <MainLayout title="Add comic">
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={10} md={8} xl={6}>
          <Card>
            <CardHeader title="Add new Comic" subheader={error} />
            <CardContent>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                sx={{ marginY: 2 }}
                value={name}
                onChange={onNameChanged}
                error={name.length <= 0 && touched}
                onBlur={() => setTouched(true)}
              />
              <TextField
                label="Author"
                variant="outlined"
                fullWidth
                sx={{ marginY: 2 }}
                value={author}
                onChange={onAuthorChanged}
                error={author.length <= 0 && touched}
                onBlur={() => setTouched(true)}
              />
              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                multiline
                sx={{ marginY: 2 }}
                value={description}
                onChange={onDescriptionChanged}
                error={description.length <= 0 && touched}
                onBlur={() => setTouched(true)}
              />
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox />}
                  label="NSFW"
                  value={nsfw}
                  onChange={onNSFWChanged}
                />
              </FormGroup>
              <Box sx={{ flex: 1, marginY: 2 }}>
                <Button variant="contained" component="label">
                  Upload image
                  <input
                    type={"file"}
                    hidden
                    onChange={onImageChanged}
                    accept="image/jpeg, image/png, image/gif"
                  />
                </Button>
              </Box>
              <Button color="primary" variant="contained" onClick={send}>
                Send
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </MainLayout>
  );
};

export default AddComicPage;
