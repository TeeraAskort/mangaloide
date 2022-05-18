import { createContext } from "react";
import { IUser } from "../../models/User";

export interface ContextProps {
  isLoggedIn: boolean;
  user?: IUser;
  loginUser: (email: string, password: string) => Promise<boolean>;
  registerUser: (
    email: string,
    username: string,
    password: string
  ) => Promise<{
    hasError: boolean;
    message?: string;
  }>;
  logout: () => void;
}

export const AuthContext = createContext({} as ContextProps);
