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

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");

  const [touched, setTouched] = useState(false);

  const router = useRouter();

  const { logIn, user } = useContext(USERContext);

  const cancel = () => {
    router.push("/");
  };

  const register = () => {
    if (username && password && passwordRepeat) {
      if (password === passwordRepeat) {
        if (!user) {
          const newUser: User = {
            username,
            password,
          };
          logIn(newUser);
        }
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

  const onPasswordRepeatChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setPasswordRepeat(event.target.value);
  };

  return (
    <MainLayout title="Register">
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={8} md={6} xl={4}>
          <Card>
            <CardHeader title="Register" />
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
              <TextField
                sx={{ marginY: 2 }}
                label="Repeat password"
                variant="outlined"
                placeholder="Repeat password"
                fullWidth
                type={"password"}
                value={passwordRepeat}
                onChange={onPasswordRepeatChanged}
                error={passwordRepeat !== password && passwordRepeat.length > 0}
                onBlur={() => setTouched(true)}
              />
              <Button variant="contained" onClick={register}>
                Register
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

export default RegisterPage;
