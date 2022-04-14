import { createContext } from "react";
import { User } from "../../interfaces/User";

export interface ContextProps {
  user: User | undefined;
  logIn: (user: User) => void;
  logOut: () => void;
}

export const USERContext = createContext({} as ContextProps);
