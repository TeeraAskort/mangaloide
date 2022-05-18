import {
  CardContent,
  Card,
  Box,
  Button,
  TextField,
  CardHeader,
  Grid,
  Select,
  MenuItem,
  SelectChangeEvent,
  InputLabel,
  FormControl,
} from "@mui/material";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { ChangeEvent, useContext, useEffect } from "react";
import { useState } from "react";
import { MainLayout } from "../../../../layouts";
import { comicsApi } from "../../../../apis";
import { Comic } from "../../../../interfaces";
import { AuthContext } from "../../../../context/auth";
import { JWT } from "../../../../utils";

const languages = ["EN", "ES", "CAT", "VA"];

const AddChapter = () => {
  const router = useRouter();

  const { isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/auth/login");
    }
  });

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

  const onLanguageChanged = (event: SelectChangeEvent) => {
    setLanguage(event.target.value as string);
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

        const { data } = await comicsApi.post<Comic>(
          `/comic/get/${comicId}/chapter`,
          bodyFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (!data) {
          setError("Error");
        }

        router.push(`/comic/${data._id}`);
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
              <FormControl sx={{ minWidth: "150px" }}>
                <InputLabel id="language-label">Language</InputLabel>
                <Select
                  labelId="language-label"
                  value={language}
                  label="Language"
                  onChange={onLanguageChanged}
                >
                  {languages.map((lang) => (
                    <MenuItem value={lang} key={lang}>
                      {lang}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { token } = ctx.req.cookies;

  try {
    await JWT.isValidToken(token);
  } catch (error) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default AddChapter;
