import { ReactNode, useEffect } from "react";
import { useReducer } from "react";
import { FC } from "react";
import { AuthContext, authReducer } from "./";
import { IUser } from "../../models/User";
import { comicsApi } from "../../apis";
import { UserResponse } from "../../interfaces";
import Cookies from "js-cookie";
import axios, { AxiosError } from "axios";

export interface AuthState {
  isLoggedIn: boolean;
  user?: IUser;
}

const AUTH_INITIAL_STATE: AuthState = {
  isLoggedIn: false,
  user: undefined,
};

interface Props {
  children: ReactNode;
}

export const AuthProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE);

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    if (Cookies.get("token")) {
      try {
        const { data } = await comicsApi.get<UserResponse>(
          "/auth/validate-token"
        );
        const { token, user } = data;
        Cookies.set("token", token!);
        dispatch({ type: "[Auth] - Login", payload: user! });
      } catch (error) {
        Cookies.remove("token");
      }
    }
  };

  const loginUser = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const { data } = await comicsApi.post("/auth/login", { email, password });
      const { token, user } = data;
      Cookies.set("token", token);
      dispatch({ type: "[Auth] - Login", payload: user });
      return true;
    } catch (error) {
      return false;
    }
  };

  const registerUser = async (
    email: string,
    username: string,
    password: string
  ): Promise<{ hasError: boolean; message?: string }> => {
    try {
      const { data } = await comicsApi.post<UserResponse>("/auth/register", {
        email,
        username,
        password,
      });
      const { token, user } = data;
      Cookies.set("token", token!);
      dispatch({ type: "[Auth] - Login", payload: user! });
      return {
        hasError: false,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<UserResponse>;
        return {
          hasError: true,
          message: err.response?.data.message!,
        };
      }
      return {
        hasError: true,
        message: "User couldn't be created, please try again",
      };
    }
  };

  const logout = () => {
    Cookies.remove("token");
    dispatch({ type: "[Auth] - Logout" });
  };

  const updateUser = (user: IUser) => {
    dispatch({ type: "[Auth] - Update user", payload: user });
  };

  return (
    <AuthContext.Provider
      value={{ ...state, loginUser, registerUser, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
