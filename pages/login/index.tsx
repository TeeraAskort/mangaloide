import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  TextField,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { ChangeEvent, useContext, useState } from "react";
import { USERContext } from "../../context/user";
import { User } from "../../interfaces/User";
import { MainLayout } from "../../layouts";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [touched, setTouched] = useState(false);

  const { logIn: logInCtxt, user } = useContext(USERContext);

  const router = useRouter();

  const cancel = () => {
    setTouched(false);
    router.push("/");
  };

  const logIn = () => {
    if (username && password) {
      if (!user) {
        setTouched(false);
        const newUser: User = {
          username,
          password,
        };
        logInCtxt(newUser);
        router.push("/");
      }
    }
  };

  const onUsernameChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const onPasswordChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  return (
    <MainLayout title="Log in">
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={8} md={6} xl={4}>
          <Card>
            <CardHeader title="Log in" />
            <CardContent>
              <TextField
                sx={{ marginY: 2 }}
                label="Username"
                variant="outlined"
                placeholder="Username"
                fullWidth
                value={username}
                onChange={onUsernameChanged}
                error={username.length <= 0 && touched}
                onBlur={() => setTouched(true)}
              />
              <TextField
                sx={{ marginY: 2 }}
                label="Password"
                variant="outlined"
                placeholder="Password"
                fullWidth
                type={"password"}
                value={password}
                onChange={onPasswordChanged}
                error={password.length <= 0 && touched}
                onBlur={() => setTouched(true)}
              />
              <Button variant="contained" onClick={logIn}>
                Log in
              </Button>
              <Button
                variant="contained"
                color="error"
                sx={{ marginX: 2, float: "right" }}
                onClick={cancel}
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </MainLayout>
  );
};

export default LoginPage;
