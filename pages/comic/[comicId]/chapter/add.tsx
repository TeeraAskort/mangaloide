import {
  CardContent,
  Card,
  Box,
  Button,
  TextField,
  CardHeader,
  Grid,
} from "@mui/material";
import { useRouter } from "next/router";
import { ChangeEvent } from "react";
import { useState } from "react";
import { MainLayout } from "../../../../layouts";
import { comicsApi } from "../../../../apis";
import { Comic } from "../../../../interfaces";

const AddChapter = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [chNumber, setChNumber] = useState("");
  const [language, setLanguage] = useState("");
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);
  const [file, setFile] = useState<File | null | undefined>(null);

  const onNameChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const onChNumberChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setChNumber(event.target.value);
  };

  const onLanguageChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setLanguage(event.target.value);
  };

  const onFileChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.item(0));
  };

  const send = async () => {
    if (file && language && name && chNumber) {
      try {
        const bodyFormData = new FormData();
        bodyFormData.append("name", name);
        bodyFormData.append("language", language);
        bodyFormData.append("chNumber", chNumber);
        bodyFormData.append("file", file);

        const { comicId } = router.query;

        const comic = await comicsApi.post<Comic>(
          `/comic/${comicId}/chapter`,
          bodyFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (!comic) {
          setError("Error");
        }
      } catch (error) {}
    }
  };

  return (
    <MainLayout title="Upload chapter">
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={10} md={8} xl={6}>
          <Card>
            <CardHeader title="Add new Chapter" subheader={error} />
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
                label="Number"
                variant="outlined"
                fullWidth
                sx={{ marginY: 2 }}
                value={chNumber}
                onChange={onChNumberChanged}
                error={chNumber.length <= 0 && touched}
                onBlur={() => setTouched(true)}
              />
              <TextField
                label="Language"
                variant="outlined"
                fullWidth
                multiline
                sx={{ marginY: 2 }}
                value={language}
                onChange={onLanguageChanged}
                error={language.length <= 0 && touched}
                onBlur={() => setTouched(true)}
              />
              <Box sx={{ flex: 1, marginY: 2 }}>
                <Button variant="contained" component="label">
                  Upload zip
                  <input
                    type={"file"}
                    hidden
                    onChange={onFileChanged}
                    accept="application/zip"
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

export default AddChapter;
