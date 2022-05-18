import { Error } from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  TextField,
  Chip,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { ChangeEvent, useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../context/auth";
import { MainLayout } from "../../layouts";
import { isValidEmail } from "../../utils";

type FormData = {
  username: string;
  email: string;
  password: string;
  repeatPassword: string;
};

const RegisterPage = () => {
  const router = useRouter();

  const { registerUser } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormData>();

  const [showError, setShowError] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const checkPasswordsAreTheSame = (
    repeatPassword: string
  ): string | undefined => {
    return repeatPassword === getValues("password")
      ? undefined
      : "Passwords do not match";
  };

  const onRegisterForm = async ({ email, password, username }: FormData) => {
    setShowError(false);

    const { hasError, message } = await registerUser(email, username, password);

    if (hasError) {
      setShowError(true);
      setErrorMessage(message!);
      return;
    }

    router.replace("/");
  };

  return (
    <MainLayout title="Register">
      <form onSubmit={handleSubmit(onRegisterForm)}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={8} md={6} xl={4}>
            <Card>
              <Chip
                label={errorMessage}
                color="error"
                sx={{ display: showError ? "flex" : "none" }}
                icon={<Error />}
              />
              <CardHeader title="Register" />
              <CardContent>
                <TextField
                  sx={{ marginY: 2 }}
                  label="Username"
                  variant="outlined"
                  placeholder="Username"
                  fullWidth
                  {...register("username", {
                    required: "The username is required",
                  })}
                  error={!!errors.username}
                  helperText={errors.username?.message}
                />
                <TextField
                  sx={{ marginY: 2 }}
                  label="Email"
                  variant="outlined"
                  placeholder="Email"
                  fullWidth
                  {...register("email", {
                    required: "The email is required",
                    validate: isValidEmail,
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
                <TextField
                  sx={{ marginY: 2 }}
                  label="Repeat password"
                  variant="outlined"
                  placeholder="Repeat password"
                  fullWidth
                  type={"password"}
                  {...register("repeatPassword", {
                    validate: checkPasswordsAreTheSame,
                  })}
                  error={!!errors.repeatPassword}
                  helperText={errors.repeatPassword?.message}
                />
                <Grid container spacing={2} justifyContent="space-between">
                  <Grid item>
                    <Button type="submit" variant="contained">
                      Register
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="success"
                      sx={{ float: "right" }}
                      href="/auth/login"
                    >
                      Login
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

export default RegisterPage;
