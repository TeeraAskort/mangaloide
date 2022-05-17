import { Error } from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  TextField,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { ChangeEvent, useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../context/auth";
import { User } from "../../interfaces/User";
import { MainLayout } from "../../layouts";
import { isEmail } from "../../utils";

type FormData = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const router = useRouter();

  const { loginUser } = useContext(AuthContext);

  const [showError, setShowError] = useState(false);

  const onLoginUser = async ({ email, password }: FormData) => {
    setShowError(false);

    const isValidLogin = await loginUser(email, password);

    if (!isValidLogin) {
      setShowError(true);
      return;
    }

    router.replace("/");
  };

  return (
    <MainLayout title="Log in">
      <form onSubmit={handleSubmit(onLoginUser)}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={8} md={6} xl={4}>
            <Card>
              <Chip
                label="Incorrect email or password"
                color="error"
                icon={<Error />}
                sx={{ display: showError ? "flex" : "none" }}
              />
              <CardHeader title="Log in" />
              <CardContent>
                <TextField
                  sx={{ marginY: 2 }}
                  label="Email"
                  variant="outlined"
                  placeholder="Email"
                  type="email"
                  fullWidth
                  {...register("email", {
                    required: "The email is required",
                    validate: isEmail,
                  })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
                <TextField
                  sx={{ marginY: 2 }}
                  label="Password"
                  variant="outlined"
                  placeholder="Password"
                  fullWidth
                  type={"password"}
                  {...register("password", {
                    required: "The password is required",
                    minLength: {
                      value: 6,
                      message:
                        "The password has to be at least 6 characters long",
                    },
                  })}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
                <Grid container spacing={2} justifyContent="space-between">
                  <Grid item>
                    <Button variant="contained" type="submit">
                      Log in
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="success"
                      sx={{ float: "right" }}
                      href="/auth/register"
                    >
                      Register
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="error"
                      sx={{ float: "right" }}
                      href="/"
                    >
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </form>
    </MainLayout>
  );
};

export default LoginPage;
